const TournamentModel = require("../models/TournamentModel");
const agenda = require('../jobs/agenda');
const InscriptionModel = require("../models/InscriptionModel");

class TournamentController {
  constructor() {}

  async showAll(req, res) {
    const tournaments = await TournamentModel.findAll();
    const myInscriptions = await InscriptionModel.findMyInscriptions(req.user.id)
    agenda.schedule('in 5 seconds', 'run tournament',{id: "5dc40127d5a80333b8741ea3"},"");
    console.log("hola");
    res.render("tournament/showAll", { tournaments: tournaments, myInscriptions: myInscriptions });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("tournament/add");
    } else {
      try {
        if(req.body.startData >= req.body.finishDate || req.body.startData > Date.now()){
          throw err;
        }
        const tournament = await TournamentModel.add(req.body);
        console.log(tournament);
        //agenda.schedule('in 10 minute', 'archive ride',{id: tournament._id},"");
        return res.redirect("/tournament");
      } catch (err) {
        req.flash("error", "Error al insertar el torneo");
        res.redirect("/tournament");
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
        console.log(newData);
        const newTournament = await TournamentModel.update(
          tournament._id,
          newData
        );
        console.log(newTournament);
        return res.redirect("/tournament");
      }
    } catch (err) {
      req.flash("error", "Error al editar su torneo");
        res.redirect("/tournament");
    }
  }

  async delete(req, res) {
    try {
      await TournamentModel.delete(req.params.id);
      console.log("ok");
      res.redirect("/tournament");
    } catch (err) {
      req.flash("error", "Error al borrar su torneo");
        res.redirect("/tournament");
    }
  }
}

module.exports = new TournamentController();
