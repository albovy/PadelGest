const TournamentModel = require("../models/TournamentModel");

class TournamentController {
  constructor() {}

  async showAll(req, res) {
    const tournaments = await TournamentModel.findAll();
    res.render("tournament/showAll", { tournaments: tournaments });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("tournament/add");
    } else {
      try {
        const tournament = await TournamentModel.add(req.body);
        console.log(tournament);
        return res.redirect("/tournament");
      } catch (err) {
        return console.log(err);
        //CUBRIR CON ERRORES DE ERROR (visto en internet un 200 OK con un mensaje de error)
      }
    }
  }

  async edit(req, res) {
    try {
      const tournament = await TournamentModel.findById(req.params.id);
      if (req.method == "GET") {
        res.render("tournament/edit", { tournament: tournament });
      } else {
        const newData = { $set: req.body };
        const newTournament = await TournamentModel.update(tournament._id,newData);
        console.log(newTournament);
      }
    } catch (err) {
        //CUBRIR CON ERRORES
    }
  }

  async delete(req,res){
    try{
      await TournamentModel.delete(req.params.id);
      console.log("ok");
    }catch(err){
      //CUBRIR CON ERRORES NO SE PUEDO BORRAR
    }
  }
}

module.exports = new TournamentController();
