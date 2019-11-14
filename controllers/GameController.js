const GameModel = require("../models/GameModel");
const ClashModel = require("../models/ClashModel");
const TournamentModel = require("../models/Tournament");
const CompetitionModel = require("../models/CompetitionModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");

class GameController {
  constructor() {}

  async showForTournament(req, res) {
    const comp = await CompetitionModel.findByTournament(req.params.id);
    console.log(comp);
    const clashes = await ClashModel.findByUserCompetitionAndAgree(
      comp._id,
      req.user.id
    );
    let games = await Promise.all(
      clashes.map(async element => {
        let game = await GameModel.findByClash(element._id);
        console.log(game);
        const court = await CourtModel.findById(game.court_id);

        let data = {
          set1_team1: game.set1_team1,
          set1_team2: game.set1_team1,
          set2_team1: game.set1_team1,
          set2_team2: game.set1_team1,
          set3_team1: game.set1_team1,
          set3_team2: game.set1_team1,
          total_team1: game.set1_team1,
          total_team2: game.set1_team1,
          _id: game._id,
          clash_id: game.clash_id,
          court_id: court.name,
          date: game.date
        };

        return data;
      })
    );

    console.log(games);

    res.render("game/showAll",{games:games,user:req.user});
  }
  async add(req, res) {
    try {
      console.log("holaaa");
      const clash = await ClashModel.findById(req.params.id);
      const comp = await CompetitionModel.findById(clash.competition_id);

      const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
      const time = req.body.time;
      const dateNow = Date.now();

      startDate.setHours(parseInt(time.split(":")[0]) + 1);
      console.log(startDate);
      startDate.setMinutes(time.split(":")[1]);
      console.log(startDate);

      if (startDate < dateNow) {
        req.flash("error", "No es posible reservar esta franja de tiempo");
        return res.redirect("/clash/tournament/" + comp.tournament_id); //redireccion a la vista show
      }

      const booksOnDate = await BookModel.findByDate(startDate); //reservas en date
      console.log(booksOnDate);
      let arrOcuped = [];
      booksOnDate.forEach(element => {
        console.log("hola");
        console.log(element);
        arrOcuped.push(element.court_id);
      });

      console.log("arrOcuped");
      const courtsAvailable = await CourtModel.findNotInRange(arrOcuped); //pistas disponibles(Array de JSONs)
      console.log("llega");
      //Comprobacion para ver si el array esta vacio
      if (courtsAvailable.length == 0) {
        console.log("no hay");
        req.flash("error", "No hay pistas libres en la hora especificada");
        return res.redirect("/tournament"); //redireccion a la vista show
      }

      //Ver que devuelve mongoDB en una consulta vacia
      const courtAv = courtsAvailable[0]._id; //id pista disponible

      const endDate = new Date(
        new Date(new Date(startDate).getTime() + 5400000)
      ); //startDate + 90min
      let game = {
        clash_id: clash._id,
        court_id: courtAv,
        date: startDate
      };
      let book = {
        user_id: req.user.id,
        court_id: courtAv,
        startDate: startDate,
        endDate: endDate
      };
      let data = { $set: { agree: true } };

      await ClashModel.edit(clash._id, data);
      console.log("actualiza");
      const bookm = await BookModel.add(book);
      const gm = await GameModel.add(game);

      return res.redirect("/game/tournament/" + comp.tournament_id);
    } catch (err) {}
  }
}

module.exports = new GameController();
