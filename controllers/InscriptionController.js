const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");
const TournamentModel = require("../models/TournamentModel");
const PayoutModel = require("../models/PayoutModel");
const nodemailer = require('nodemailer');

class InscriptionController {
  constructor() {}

  async show(req,res){
    console.log("hola");
    const myInscriptions = await InscriptionModel.findMyInscriptions(req.user.id);
    res.render("inscription/showAll",{inscriptions : myInscriptions});
  }

  async add(req, res) {
    try {
      const dateNow = Date.now();
      const tournament = await TournamentModel.findById(req.params.id);
      if(tournament.started) throw err;
      if(tournament.startDate < dateNow){
          req.flash("error","El campeonato ya ha empezado");
          return res.redirect("/tournament");
      }

      const user2 = await UserModel.findOne(req.body.user2_login);
      const user = await UserModel.findById(req.user.id);
      if (user2 == null) throw err;

      let count = await InscriptionModel.findIfImAlreadyInscripted(tournament._id, req.user.id);
      if(count > 0) throw err;
      count = await InscriptionModel.findIfImAlreadyInscripted(tournament._id,user2._id);
      if(count > 0) throw err;

      let gender = "MAN";
      console.log(req.user.gender)
      if(req.user.gender == "WOMAN" && user2.gender == "WOMAN"){
        gender = "WOMAN";
      }else{
        if(user2.gender != req.user.gender){
          gender= "MIXED";
        }
      }

      let data = {
        user1_id: req.user.id,
        user2_id: user2._id,
        tournament_id: req.params.id,
        category: req.body.category,
        gender: gender,
        inscriptionDate: dateNow
      };

      let payData = {
        user_id: req.user.id,
        billingAddress: req.body.billingAddress,
        creditCard: req.body.creditCard,
        amount: req.params.amount,
        concept: req.body.concept,
        date: dateNow
      };
      console.log(payData);
      const inscription = await InscriptionModel.add(data);
      const pay = await PayoutModel.add(payData);
      console.log("INSCRITO y pagao");
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
        subject: 'Inscripción a clase particular efectuada',
        html: '<p>Tu inscripción a la clase particular ha sido efectuada, accede a nuestro sitio Web para comprobarlo.</p><p>Un saludo, el equipo de PadelGest.</p>'
      };
      transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
      });
      const message2 = {
        from: 'padelgest2020@gmail.com',
        to: user2.email,
        subject: 'Inscripción a torneo efectuada',
        html: '<p>Tu inscripción para el torneo ha sido registrada, accede a nuestro sitio Web para comprobarlo y gestionarlo.</p><p>Un saludo, el equipo de PadelGest.</p>'
      };
      transporter.sendMail(message2, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
      });
      return res.redirect("/tournament");
    } catch (err) {
      console.log("Error");
      req.flash("error", "Error al procesar su inscripcion :(");
      res.redirect("/tournament");
    }
  }

  async delete(req,res){
    try {

      await InscriptionModel.delete(req.params.id,req.user.id);
      console.log("ok");
      res.redirect("/tournament");
    } catch (err) {
      req.flash("error", "Error al borrar su inscripcion");
      res.redirect("/tournament");
    }
  }
}

module.exports = new InscriptionController();
