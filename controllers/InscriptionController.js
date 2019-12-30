const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");
const TournamentModel = require("../models/TournamentModel");
const PayoutModel = require("../models/PayoutModel");

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
