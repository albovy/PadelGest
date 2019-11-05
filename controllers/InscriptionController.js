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
      console.log(req.body);
      const dateNow = Date.now();
      const tournament = await TournamentModel.findById(req.params.id);
      console.log(tournament);
      if(tournament.startDate < dateNow){
          req.flash("error","El campeonato ya ha empezado");
          return res.redirect("/tournament");
      }
      const user2 = await UserModel.findOne(req.body.user2_login);
      if (user2 == null) throw err;
      console.log(user2._id);
      console.log(req.user.id);
      console.log(req.body.category);
      let data = {
        user1_id: req.user.id,
        user2_id: user2._id,
        tournament_id: req.params.id,
        category: req.body.category,
        inscriptionDate: dateNow
      };
      console.log(data);
      const inscription = await InscriptionModel.add(data);
      console.log(inscription);
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
