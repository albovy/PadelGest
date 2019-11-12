const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");
const TournamentModel = require("../models/TournamentModel");

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
      let data = {
        user1_id: req.user.id,
        user2_id: user2._id,
        tournament_id: req.params.id,
        category: req.body.category,
        gender: req.body.gender,
        inscriptionDate: dateNow
      };
      const inscription = await InscriptionModel.add(data);
      return res.redirect("/tournament");
    } catch (err) {
      //ERRORES
      console.log("Error");
    }
  }

  async delete(req,res){
    try {
      await InscriptionModel.delete(req.params.id);
      console.log("ok");
      res.redirect("/inscription");
    } catch (err) {
      //CUBRIR CON ERRORES NO SE PUEDO BORRAR
    }
  }
}

module.exports = new InscriptionController();
