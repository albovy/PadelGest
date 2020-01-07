const PrivateCoachingInscriptionModel = require("../models/PrivateCoachingInscriptionModel");
const PrivateCoachingModel = require("../models/PrivateCoachingModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const UserModel = require("../models/UserModel");
const PayoutModel = require("../models/PayoutModel");

class PrivateCoachingInscriptionController {
  constructor() {}

  async showAll(req, res) {
    const privCoach = await PrivateCoachingModel.findAll();
    const user = await UserModel.findById(req.user.id);
    res.render("privateCoaching/showAll", { privCoach: privCoach, user: user });
  }

  async add(req, res) {
    try {
      console.log("Hola")
      const dateNow = Date.now();
      const privCoaching = await PrivateCoachingModel.findById(req.params.id);
      if (privCoaching.date < dateNow) {
        const getInscripted = await PrivateCoachingInscriptionModel.findInscriptionsByCoaching(
          req.params.id
        );
        getInscripted.forEach(async elemnt => {
          await PrivateCoachingInscriptionModel.delete(elemnt._id);
        });
        req.flash("error", "La clase ya se ha realizado.");
        await PrivateCoachingModel.delete(req.params.id);
        return res.redirect("/privateCoaching/showInscriptions");
      }

      let data = { user_id: req.user.id, privateCoaching_id: req.params.id };
      console.log(data);
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
        (await PrivateCoachingInscriptionModel.findIfImAlreadyInscripted(data)) > 0
      ) {
        req.flash("error", "Ya estás inscrito en esta clase.");
        return res.redirect("/privateCoaching/showInscriptions");
      }
        // await PrivateCoachingInscriptionModel.add(data);
        if (CourtModel.countCourts() == BookModel.countBooksOnDate()) {
          const getInscripted = await PrivateCoachingInscriptionModel.findInscriptionsByCoaching(
            req.params.id
          );
          getInscripted.forEach(async elemnt => {
            await PrivateCoachingInscriptionModel.delete(elemnt._id);
          });

          console.log("Salta el error de pistas no disponibles");
          req.flash("error", "No se ha podido efectuar la reserva.");
          await PrivateCoachingModel.delete(req.params.id);
          return res.redirect("/privateCoaching/showInscriptions");
        } else {
          const startDate = privCoaching.date;
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
            await PrivateCoachingInscriptionModel.add(data);
            await PayoutModel.add(payData);
            console.log(book);
            console.log("Tiene pinta de que ha funcionao");
            await PrivateCoachingModel.edit(req.params.id, {
            });
            res.redirect("/privateCoaching/showInscriptions");
          } else {
              console.log(req.params.id);
            const getInscripted = await PrivateCoachingInscriptionModel.findInscriptionsByCoaching(req.params.id);
            getInscripted.forEach(async elemnt => {
              await PrivateCoachingInscriptionModel.delete(elemnt._id);
            });
            req.flash("error", "La clase ya se ha realizado.");
            await PrivateCoachingModel.delete(req.params.id);
            return res.redirect("/privateCoaching");
          }
        } 
    } catch (err) {
      console.log(err);
      req.flash(
        "error",
        "Error al insertar su inscripcion a la clase"
      );
      res.redirect("/privateCoaching");
    }
  }

  async delete(req, res) {
    try {
      const privCoaching = await PrivateCoachingModel.findById(req.params.id);
   
      await PrivateCoachingInscriptionModel.deleteUser(req.params.id, req.user.id);
      res.redirect("/privateCoaching/showInscriptions");
    } catch (err) {
      console.log("F");
      req.flash(
        "error",
        "Error al borrar su inscripcion del partido privCoachingcionado"
      );
      res.redirect("/privateCoaching");
    }
  }
}

module.exports = new PrivateCoachingInscriptionController();
