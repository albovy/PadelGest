const PayoutModel = require("../models/PayoutModel");
const UserModel = require("../models/UserModel");
const nodemailer = require('nodemailer');

class PayoutController {
  constructor() {}

  async info(req, res){
    if (req.method == "GET") {
      const user = await UserModel.findById(req.user.id);
      console.log(user);
      res.render("payout/info", {
        user: user
      });
    }else{
      try{
        res.redirect("/payout/member");
      }catch(err){
        res.redirect("/payout");
      }
    }
  }

  async show(req, res) {
    console.log("Probando");
    const myPayouts = await PayoutModel.findMyPayouts(
      req.user.id
    );

    let array = await Promise.all(
      myPayouts.map(async element => {
        element.date.setHours(element.date.getHours() - 1);
        let options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        };
        let data = {
          billingAddress: element.billingAddress,
          creditCard: element.creditCard,
          amount: element.amount,
          concept: element.concept,
          date: element.date.toLocaleDateString("es-ES", options)
        };
        return data;
      })
    );
    console.log(array);

    res.render("payout/show", {
      payouts: array,
      user: req.user
    });
  }

  async member(req, res) {
    if (req.method == "GET") {
      //console.log(req.params);
      const prize = 25;
      res.render("payout/member", { user: req.user, amount: prize});
    } else {
      try {
        const dateNow = Date.now();

        let data2 = {
          user_id: req.user.id,
          billingAddress: req.body.billingAddress,
          creditCard: req.body.creditCard,
          amount: req.body.amount,
          concept: req.body.concept,
          date: dateNow
        };
        const pay = await PayoutModel.add(data2);
        const newData = { $set: { member: true, memberDate: dateNow} };
        const newUser = await UserModel.update(req.user.id, newData);
        console.log(newUser);
        const user = await UserModel.findById(req.user.id);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: 'padelgest2020@gmail.com',
            pass: 'padel20gest'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        const message = {
          from: 'padelgest2020@gmail.com',
          to: user.email,
          subject: 'Bienvenido al programa de socios',
          html: '<p>Te has suscrito al programa de socios, gracias por confiar en PadelGest.</p><p>Durante este mes disfruta de un 30% de descuento en todas las actividades disponibles</p><p>Un saludo, el equipo de PadelGest.</p>'
        };
        transporter.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
        });

        return res.redirect("/payout");
      } catch (err) {
        req.flash("error", "Error al efectuar el pago");
        console.log(err);
        res.redirect("/payout");
      }
    }
  }

  async add(req, res) {
    if (req.method == "GET") {
      console.log("Holaaaaaa");
      res.render("payout/add", { user: req.user });
    } else {
      try {
        const dateNow = Date.now();

        let data = {
          user_id: req.user._id,
          billingAddress: req.body.billingAddress,
          creditCard: req.body.creditCard,
          amount: req.body.amount,
          concept: req.body.concept,
          date: dateNow
        };
        const pay = await PayoutModel.add(data);
        return res.redirect("/index");
      } catch (err) {
        req.flash("error", "Error al efectuar el pago");
        res.redirect("/index");
      }
    }
  }

  async delete(req, res) {
    try {
      await PayoutModel.delete(req.params.id);
      const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(
        req.params.id
      );
      getInscripted.forEach(async elemnt => {
        await PromotedInscriptionModel.delete(elemnt._id);
      });
      return res.redirect("/promoted");
    } catch (err) {
      req.flash("error", "Error al borrar su partido promocionado");
      res.redirect("/promoted");
    }
  }
}

module.exports = new PayoutController();
