const GameModel = require("../models/GameModel");
const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");
const BookModel = require("../models/BookModel");

class GameController {
  constructor() {}

  show(req, res) {}
  async add(req, res) {
    try {
      console.log("holaaa");
      const clash = await ClashModel.findById(req.params.id);
      console.log(clash);
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
        return res.redirect("/clash/tournament/"+comp.tournament_id); //redireccion a la vista show
      }
      const courtsAvailable = await CourtModel.findNotInRange(arrOcuped); //pistas disponibles(Array de JSONs)
      //Comprobacion para ver si el array esta vacio
      if (courtsAvailable.length == 0) {
        req.flash("error", "No hay pistas libres en la hora especificada");
        return res.redirect("/book"); //redireccion a la vista show
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
      const bookm = await BookModel.add(book);
      const gm = await GameModel.add(game);
      return res.redirect("/game");
      
    } catch (err) {
      return res.redirect("/clash/tournament/"+comp.tournament_id); 
    }
  }
}

module.exports = new GameController();
