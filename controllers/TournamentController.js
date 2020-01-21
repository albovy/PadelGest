const TournamentModel = require("../models/TournamentModel");
const agenda = require("../jobs/agenda");
const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");
const GroupModel = require("../models/GroupModel");
const CompetitionModel = require("../models/CompetitionModel");
const ClashModel = require("../models/ClashModel");

class TournamentController {
  constructor() {}

  async showAll(req, res) {
    const tournaments = await TournamentModel.findAll();
    const user = await UserModel.findById(req.user.id);

    let tournamentMoreInscription = await Promise.all(
      tournaments.map(async element => {
        let options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        };
        element.startDate.setHours(element.startDate.getHours() - 1);
        element.finishDate.setHours(element.finishDate.getHours() - 1);
        console.log(element.finishDate);

        if (user.member == true) {
          element.price = element.price * 0.7;
        }
        let data = {
          started: element.started,
          _id: element._id,
          type: element.type,
          title: element.title,
          description: element.description,
          startDate: element.startDate.toLocaleTimeString("es-ES", options),
          finishDate: element.finishDate.toLocaleDateString("es-ES", options),
          finishDate2: element.finishDate,
          price: element.price
        };
        let ins = await InscriptionModel.findIfImAlreadyInscripted(
          element._id,
          req.user.id
        );
        if (ins > 0) data.inscripted = true;

        let clasificated = await GroupModel.findIfClasificated(element._id,req.user.id);
        console.log(clasificated);

        if(clasificated.length >0) data.clasificated = true;

        return data;
      })
    );

    //agenda.schedule('in 5 seconds', 'run tournament',{id:"5e272ca93a1c95b2ec5f4b04"},"");
    //agenda.schedule("in 5 seconds","run playoff",{ id: "5e27379c51e077b40ddf60be" },"");
    res.render("tournament/showAll", {
      tournaments: tournamentMoreInscription,
      user: req.user,
      today: Date.now()
    });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("tournament/add", { user: req.user });
    } else {
      console.log("holaaa");
      try {
        if (
          req.body.startDate >= req.body.finishDate ||
          req.body.startDate < Date.now()
        ) {
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
        res.render("tournament/edit", {
          tournament: tournament,
          user: req.user
        });
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
  async groups(req, res) {
    if (req.method == "GET") {
      const categories = await GroupModel.distinctCategory(req.params.id);
      console.log(categories);
      let array = [];

      array = await Promise.all(
        categories.map(async category => {
          let subGroups = await GroupModel.countDistinctSubgroup(
            req.params.id,
            category
          );
          console.log(subGroups);
          let info = {};
          info = await Promise.all(
            subGroups.map(async subGroup => {
              let clasificated = await GroupModel.countGroupsTournamentAndCatAndSub(
                req.params.id,
                category,
                subGroup
              );
              console.log(clasificated);
              if (clasificated == 4 || clasificated == 2) {
                let info2 = {};
                info2.tournament_id = req.params.id;
                info2.category = category;
                info2.subGroup = subGroup;

                return info2;
              }
            })
          );

          return info[0];
        })
      );
      console.log(array);
      array = array.filter(element => element != null);
      console.log(array);

      if (array.length == 0) array = null;

      res.render("tournament/showGroups", { user: req.user, array: array });
    } else {
      const comp = await CompetitionModel.findByTournament(
        req.params.id,
        "PLAYOFF"
      );
      console.log(comp);
      console.log("Wtf");
      console.log(req.body);
      const groups = await GroupModel.findGroupsTournamentAndCatAndSubClasificated(
        req.params.id,
        req.body.category,
        req.body.subGroup
      );

      for (let i = groups.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [groups[i], groups[j]] = [groups[j], groups[i]];
      }

      let clash = {
        competition_id: comp._id
      };
      for (let z = 0; z < groups.length / 2; z++) {
        clash.user1_id = groups[z].user1_id;
        clash.user2_id = groups[z].user2_id;
        clash.user3_id = groups[groups.length-1-z].user1_id;
        clash.user4_id = groups[groups.length-1-z].user2_id;

        await ClashModel.add(clash);
      }

      return res.redirect("/tournament");
    }
  }
}

module.exports = new TournamentController();
