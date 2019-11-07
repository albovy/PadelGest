//const MongoClient = require('mongodb').MongoClient;
const TournamentModel = require("../../models/TournamentModel");
const InscriptionModel = require("../../models/InscriptionModel");
const GroupModel = require("../../models/GroupModel");

module.exports = function(agenda) {
  agenda.define("run tournament", async function(job, done) {
    console.log("holaaaa");
    const tournament = await TournamentModel.findById(job.attrs.data.id);
    if (tournament.started) {
      done();
    } else {
      //GET ALL INSCRIPTIONS
      const inscriptions = await InscriptionModel.findInscriptionsByTournament(
        tournament._id
      );

      //FILTER BY CATEGORY
      let m1 = inscriptions.filter(item => {
        return item.category == 1 && item.gender == "m";
      });
      const numberPeopleGroup = m1.length;
      //REMOVE IF LESS THAN 8
      if (numberPeopleGroup < 8) {
        m1.forEach(async item => {
          await InscriptionModel.delete(item._id);
        });
        job.remove(err => {
          console.log(err);
        });
        done();
        //REMOVE IF BETWEEN 12-16
      } else if (numberPeopleGroup > 12 && numberPeopleGroup < 16) {
        for (let i = 12; i < numberPeopleGroup; i++) {
          m1.remove(0);
        }
      }

      //SUBGROUPS
      let maxDiv = 0;
      let minDiv = 12;
      let maxRes = 0;
      let minRes = 12;
      let chosen = 0;
      let stop = false;
      let i = 8;

      while (i < 13 && !stop) {
        if (numberPeopleGroup % i == 0) {
          stop = true;
          chosen = i;
        } else {
          let res = numberPeopleGroup % i;
          if (res > maxRes) {
            maxDiv = i;
            maxRes = res;
          }
          if (res < minRes) {
            minDiv = i;
            minRes = res;
          }
        }
        i++;
      }
      if (stop) {
        console.log(chosen);
        let data = {};
        data.tournament_id = tournament._id;
        for (let j = 0; j < numberPeopleGroup; j++) {
            data.user1_id = m1[j].user1_id;
            data.user2_id = m1[j].user2_id;
            data.group = m1[j].category.toString() + m1[j].gender;
            data.subGroup = Math.floor(j/chosen);

            console.log(data);
        }
      }
      job.remove(err => {
        console.log(err);
      });
      done();
    }

  });
};
