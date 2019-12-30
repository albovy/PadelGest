const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");
const PromotedGameModel = require("../models/PromotedGameModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const UserModel = require("../models/UserModel");
const PayoutModel = require("../models/PayoutModel");

class PromotedInscriptionController {
  constructor() {}

  async showAll(req, res) {
    const promos = await PromotedGameModel.findAll();
    console.log("Hola");
    const user = await UserModel.findById(req.user.id);
    let prize = 4;
    if(user.member==true){
      prize = 4*0.7;
      prize = prize.toFixed(2);
    }

    res.render("promoted/showAll", { promos: promos, user: user, amount: prize });
  }

  async add(req, res) {
    try {
      console.log(req.params.amount);
      const dateNow = Date.now();
      const promo = await PromotedGameModel.findById(req.params.id);
      if (promo.date < dateNow) {
        const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(
          req.params.id
        );
        getInscripted.forEach(async elemnt => {
          await PromotedInscriptionModel.delete(elemnt._id);
        });
        req.flash("error", "El partido promocionado ya se ha jugado.");
        await PromotedGameModel.delete(req.params.id);
        return res.redirect("/promoted/showInscriptions");
      }

      let data = { user_id: req.user.id, promoted_id: req.params.id };

      let payData = {
        user_id: req.user.id,
        billingAddress: req.body.billingAddress,
        creditCard: req.body.creditCard,
        amount: req.params.amount,
        concept: req.body.concept,
        date: dateNow
      };
      console.log(payData);

      if (
        (await PromotedInscriptionModel.findIfImAlreadyInscripted(data)) > 0
      ) {
        req.flash("error", "Ya estás inscrito en este partido promocionado.");
        return res.redirect("/promoted/showInscriptions");
      }
      if (promo.numPlayers < 3) {
        //Solo hay dos apuntados al promocionado
        console.log("Vamos bien");

        await PromotedInscriptionModel.add(data);
        const newData = { $set: { numPlayers: (promo.numPlayers += 1) } };
        await PromotedGameModel.incrementNumPlayers(req.params.id, newData);
        await PayoutModel.add(payData);
        //console.log(a);
        return res.redirect("/promoted/showInscriptions");
      } else {
        //Hay 3 apuntados al promo y se va a apuntar el cuarto, se efectua reserva si hay pista libre
        console.log("Prueba cuarto miembro promocionado");
        if (CourtModel.countCourts() == BookModel.countBooksOnDate()) {
          const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(
            req.params.id
          );
          getInscripted.forEach(async elemnt => {
            await PromotedInscriptionModel.delete(elemnt._id);
          });

          console.log("Salta el error de pistas no disponibles");
          req.flash("error", "No se ha podido efectuar la reserva.");
          await PromotedGameModel.delete(req.params.id);
          return res.redirect("/promoted/showInscriptions");
        } else if (promo.numPlayers == 3) {
          const startDate = promo.date;
          console.log("Vamos bien");
          const booksOnDate = await BookModel.findByDate(startDate);
          const arrOcuped = [];
          booksOnDate.forEach(element => {
            arrOcuped.push(element.court_id);
          });
          console.log(arrOcuped);

          const courtsAvailable = await CourtModel.findNotInRange(arrOcuped);
          console.log(courtsAvailable);
          if (courtsAvailable.length != 0) {
            const courtAv = courtsAvailable[0]._id;
            const endDate = new Date(
              new Date(new Date(startDate).getTime() + 5400000)
            );

            let data2 = {
              user_id: "5dcd9c80fc13ae03c3000100",
              court_id: courtAv,
              startDate: startDate,
              endDate: endDate
            };
            const book = await BookModel.add(data2);
            await PromotedInscriptionModel.add(data);
            const inc = { $set: { numPlayers: (promo.numPlayers += 1) } };
            await PromotedGameModel.incrementNumPlayers(req.params.id, inc);
            console.log(book);
            console.log("Tiene pinta de que ha funcionao");
            await PromotedGameModel.edit(req.params.id, {
              $set: { granted: true }
            });
            await PayoutModel.add(payData);
            res.redirect("/promoted/showInscriptions");
          } else {
              console.log(req.params.id);
            const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(req.params.id);
            getInscripted.forEach(async elemnt => {
              await PromotedInscriptionModel.delete(elemnt._id);
            });
            req.flash("error", "El partido promocionado ya se ha jugado.");
            await PromotedGameModel.delete(req.params.id);
            return res.redirect("/promoted");
          }
        } else {
          console.log("4 personas inscritas ya");
          req.flash("error", "Ya hay 4 personas inscritas.");
          return res.redirect("/promoted");
        }
      }
    } catch (err) {
      console.log(err);
      req.flash(
        "error",
        "Error al insertar su inscripcion al partido promocionado"
      );
      res.redirect("/promoted");
    }
  }

  async delete(req, res) {
    try {
      const promo = await PromotedGameModel.findById(req.params.id);
      const dataa = { $set: { numPlayers: (promo.numPlayers -= 1) } };

      await PromotedGameModel.incrementNumPlayers(req.params.id, dataa); //Es decrementar en verdad
      await PromotedInscriptionModel.deleteUser(req.params.id, req.user.id);
      res.redirect("/promoted/showInscriptions");
    } catch (err) {
      console.log("F");
      req.flash(
        "error",
        "Error al borrar su inscripcion del partido promocionado"
      );
      res.redirect("/promoted");
    }
  }
}

module.exports = new PromotedInscriptionController();
