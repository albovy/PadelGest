const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");
const TournamentModel = require("../models/TournamentModel");
const CourtModel = require("../models/CourtModel");
const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");
const nodemailer = require('nodemailer');
const Email = require('email-templates');

class ClashController {
  constructor() {}

  async show(req, res) {
    console.log("showClash");
    const myClash = await ClashModel.findByUser(req.user.id);

    res.render("clash/showAll", { clashes: myClash });
  }

  async contact(req,res){
    let lider1 = await UserModel.findOne(req.params.user1_id);
    let lider2 = await UserModel.findOne(req.params.user3_id);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'padelgest2020@gmail.com',
        pass: 'padel20gest'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const email = new Email({
      message: {
        from: 'padelgest2020@gmail.com'
      },
      // uncomment below to send emails in development/test env:
      send: true,
      transport: transporter,
      preview: false
    });
     
    email.send({
        template: 'contact',
        message: {
          to: lider1.email
        },
        locals: {
          username: lider1.login,
          lider1: lider1.email,
          lider2: lider2.email
        }
      })
      .then(console.log)
      .catch(console.error);

      email.send({
        template: 'contact',
        message: {
          to: lider2.email
        },
        locals: {
          username: lider2.login,
          lider1: lider1.email,
          lider2: lider2.email
        }
      })
      .then(console.log)
      .catch(console.error);

       res.redirect('/tournament');
  }

  async showTournament(req, res) {
    try {
      console.log("showTournament");
      const torn = await TournamentModel.findById(req.params.id);
      const comp = await CompetitionModel.findByTournament(torn._id,torn.type);
      console.log(comp._id);
      console.log(req.user.id);
      const myClash = await ClashModel.findByUserAndCompetition(
        comp._id,
        req.user.id
      );
      console.log(myClash);
      let dateComp = {
        startDate: comp.startDate.getTime(),
        finishDate: comp.finishDate.getTime()
      };
      const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange2(comp.startDate,comp.finishDate);
      const numCourts = await CourtModel.countCourts();

      let arrayDatesFullBooked = await Promise.all(
        atLeastOneBookDates.map(async startDate => {
          const numResults = await BookModel.countBooksOnDate(startDate);

          if (numResults == numCourts) {
            
            return new Date(startDate).getTime() - 3600000;
          }
        })
      );
      arrayDatesFullBooked= arrayDatesFullBooked.filter(element=>element!=null);

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
