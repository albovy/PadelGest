const GameModel = require("../models/GameModel");
const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const UserModel = require("../models/UserModel");
const ClasificationModel = require("../models/ClasificationModel");
class GameController {
  constructor() {}

  async showForTournament(req, res) {
    const comp = await CompetitionModel.findByTournament(req.params.id);
    console.log(comp);
    let games = [];
    let clashes = [];
    if (req.user.role == "ADMIN") {
      clashes = await ClashModel.findByCompetition(comp._id);
      games = await Promise.all(
        clashes.map(async element => {
          let game = await GameModel.findByClash(element._id);

          if (game != null && game.total_team1 == 0 && game.total_team2 == 0 && game.date <= Date.now()) {
            const court = await CourtModel.findById(game.court_id);

            const user1 = await UserModel.findById(element.user1_id);
            const user2 = await UserModel.findById(element.user2_id);
            const user3 = await UserModel.findById(element.user3_id);
            const user4 = await UserModel.findById(element.user4_id);

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
              user1: user1.login,
              user2: user2.login,
              user3: user3.login,
              user4: user4.login,
              date: game.date
            };

            return data;
          }
        })
      );
      games = games.filter(element => element != null);
    } else {
      clashes = await ClashModel.findByUserCompetitionAndAgree(
        comp._id,
        req.user.id
      );

      games = await Promise.all(
        clashes.map(async element => {
          let game = await GameModel.findByClash(element._id);

          const court = await CourtModel.findById(game.court_id);
          const user1 = await UserModel.findById(element.user1_id);
          const user2 = await UserModel.findById(element.user2_id);
          const user3 = await UserModel.findById(element.user3_id);
          const user4 = await UserModel.findById(element.user4_id);

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
            user1: user1.login,
            user2: user2.login,
            user3: user3.login,
            user4: user4.login,
            date: game.date
          };

          return data;
        })
      );
    }

    console.log(games);

    res.render("game/showAll", { games: games, user: req.user });
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
        user_id: "5dcd9c80fc13ae03c3000100",
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

  async results(req, res) {
    let game = await GameModel.findById(req.params.id);

    console.log(game);
    console.log(req.body);
    let total_team1 = 0;
    let total_team2 = 0;
    let data = {};
    data.set1_team1 = parseInt(req.body.set1_team1);
    data.set1_team2 = parseInt(req.body.set1_team2);
    data.set2_team1 = parseInt(req.body.set2_team1);
    data.set2_team2 = parseInt(req.body.set2_team2);
    if (req.body.set3_team1 == "") {
      total_team1 =
        parseInt(req.body.set1_team1) + parseInt(req.body.set2_team1);
      total_team2 =
        parseInt(req.body.set1_team2) + parseInt(req.body.set2_team2);
      console.log(total_team1);
      console.log(total_team2);
    } else {
      total_team1 =
        parseInt(req.body.set1_team1) +
        parseInt(req.body.set2_team1) +
        parseInt(req.body.set3_team1);
      total_team2 =
        parseInt(req.body.set1_team2) +
        parseInt(req.body.set2_team2) +
        parseInt(req.body.set3_team2);
      console.log(total_team1);
      console.log(total_team2);
      data.set3_team1 = parseInt(req.body.set3_team1);
      data.set3_team2 = parseInt(req.body.set3_team2);
    }
    data.total_team1 = total_team1;
    data.total_team2 = total_team2;
    const clash = await ClashModel.findById(game.clash_id);
    console.log(clash);
    let clasification = await ClasificationModel.findByCompAndUser(
      clash.competition_id,
      clash.user1_id
    );
    let clasification2 = await ClasificationModel.findByCompAndUser(
      clash.competition_id,
      clash.user3_id
    );


    let up = { $set: data };
    game = await GameModel.update(game._id,up);

    if (total_team1 > total_team2) {
      let clas = {
        points: clasification.points + 3
      };
      clasification = await ClasificationModel.update(clasification._id,{$set:clas});
      console.log(clasification);
    } else {
      let clas = {
        points: clasification2.points + 3
      };
      clasification2 = await ClasificationModel.update(clasification2._id,{$set:clas});
      console.log(clasification2);
    }

    return res.redirect("/tournament");
  }
}

module.exports = new GameController();
