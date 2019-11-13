const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");
const CourtModel = require("../models/CourtModel");
const BookModel = require("../models/BookModel");

class ClashController {
  constructor() {}

  async show(req, res) {
    console.log("showClash");
    const myClash = await ClashModel.findByUser(req.user.id);
    res.render("clash/showAll", { clashes: myClash });
  }

  async showTournament(req, res) {
    try{
    console.log("showTournament");
    const comp = await CompetitionModel.findByTournament(req.params.id);
    console.log(comp._id);
    const myClash = await ClashModel.findByUserAndCompetition(
      comp._id,
      req.user.id
    );
    console.log(comp);
    let dateComp = {
      startDate: comp.startDate.getTime(),
      finishDate: comp.finishDate.getTime()
    };
    console.log(dateComp);
    const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange();
    console.log(atLeastOneBookDates);
    const numCourts = await CourtModel.countCourts();

    let arrayDatesFullBooked = await Promise.all(
      atLeastOneBookDates.map(async startDate => {
        const numResults = await BookModel.countBooksOnDate(startDate);

        if (numResults == numCourts) {
          console.log("hola");
          return new Date(startDate).getTime() - 3600000;
        }
      })
    );

    console.log(arrayDatesFullBooked);
    res.render("clash/showAll", {
      clashes: myClash,
      user: req.user,
      dateComp: dateComp,
      arrOcuped: arrayDatesFullBooked
    });
  }catch(err){
    console.log("errrorr")
  }
}
}

module.exports = new ClashController();
