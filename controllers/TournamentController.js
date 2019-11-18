const TournamentModel = require("../models/TournamentModel");
const agenda = require('../jobs/agenda');
const InscriptionModel = require("../models/InscriptionModel");

class TournamentController {
  constructor() {}

  async showAll(req, res) {
    const tournaments = await TournamentModel.findAll();
 
    let tournamentMoreInscription = await Promise.all(tournaments.map(async element=>{
      let options ={
        weekday:"long",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"
      };
      element.startDate.setHours(element.startDate.getHours()-1);
      element.finishDate.setHours(element.finishDate.getHours()-1);
        let data ={
          started : element.started,
          _id : element._id,
          title: element.title,
          description: element.description,
          startDate : element.startDate.toLocaleTimeString("es-ES",options),
          finishDate : element.finishDate.toLocaleDateString("es-ES",options)
        }
        let ins = await InscriptionModel.findIfImAlreadyInscripted(element._id,req.user.id);
        if(ins>0)data.inscripted = true;
        

        return data;
    }));

    //agenda.schedule('in 5 seconds', 'run tournament',{id: "5dd131ccfba3cf2e66e10e1e"},"");
    console.log("hola");
    res.render("tournament/showAll", { tournaments: tournamentMoreInscription, user: req.user});
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("tournament/add",{user:req.user});
    } else {
      console.log("holaaa");
      try {
        if(req.body.startDate >= req.body.finishDate || req.body.startDate < Date.now()){
          throw err;
        }
        const tournament = await TournamentModel.add(req.body);
        console.log(tournament);
        agenda.schedule(req.body.startDate, 'run tournament',{id: tournament._id},"");
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
      console.log(tournament);
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
