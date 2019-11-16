const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");
const CourtModel = require("../models/CourtModel");
const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");

class ClashController {
  constructor() {}

  async show(req, res) {
    console.log("showClash");
    const myClash = await ClashModel.findByUser(req.user.id);

    res.render("clash/showAll", { clashes: myClash });
  }

  async showTournament(req, res) {
    try {
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
      const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange2(comp.startDate,comp.finishDate);
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
      arrayDatesFullBooked= arrayDatesFullBooked.filter(element=>element!=null);
      console.log(arrayDatesFullBooked)
      let array = await Promise.all(
        myClash.map(async clash => {
          let user1 = await UserModel.findById(clash.user1_id);
          let user2 = await UserModel.findById(clash.user2_id);
          let user3 = await UserModel.findById(clash.user3_id);
          let user4 = await UserModel.findById(clash.user4_id);
          let data={
            agree: clash.agree,
            _id: clash._id,
            competition_id: clash.competition_id,
            user1_id: user1.login,
            user2_id: user2.login,
            user3_id: user3.login,
            user4_id: user4.login,
          }
          return data;
          
        })
      );
      res.render("clash/showAll", {
        clashes: array,
        user: req.user,
        dateComp: dateComp,
        arrOcuped: arrayDatesFullBooked
      });
    } catch (err) {
      console.log("errrorr");
    }
  }
}

module.exports = new ClashController();
