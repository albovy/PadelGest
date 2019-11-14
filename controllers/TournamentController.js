const TournamentModel = require("../models/TournamentModel");
const agenda = require('../jobs/agenda');
const InscriptionModel = require("../models/InscriptionModel");

class TournamentController {
  constructor() {}

  async showAll(req, res) {
    const tournaments = await TournamentModel.findAll();
 
    let tournamentMoreInscription = await Promise.all(tournaments.map(async element=>{
        let data ={
          started : element.started,
          _id : element._id,
          title: element.title,
          description: element.description,
          startDate : element.startDate,
          finishDate : element.finishDate
        }
        let ins = await InscriptionModel.findIfImAlreadyInscripted(element._id,req.user.id);
        if(ins>0)data.inscripted = true;
        

        return data;
    }));

    agenda.schedule('in 5 seconds', 'run tournament',{id: "5dcd9e111b498ee4eaea8796"},"");
    console.log("hola");
    res.render("tournament/showAll", { tournaments: tournamentMoreInscription, user: req.user});
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("tournament/add",{user:req.user});
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
        res.render("tournament/edit", { tournament: tournament,user:req.user });
      } else {
        console.log(req.body);
        const newData = { $set: req.body };
        const newTournament = await TournamentModel.update(
          tournament._id,
          newData
        );
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
