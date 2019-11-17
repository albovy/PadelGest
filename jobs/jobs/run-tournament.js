//const MongoClient = require('mongodb').MongoClient;
const TournamentModel = require("../../models/TournamentModel");
const InscriptionModel = require("../../models/InscriptionModel");
const GroupModel = require("../../models/GroupModel");
const CompetitionModel = require("../../models/CompetitionModel");
const ClasificationModel = require("../../models/ClasificationModel");
const ClashModel = require("../../models/ClashModel");

module.exports = function(agenda) {
  agenda.define("run tournament", async function(job, done) {
    console.log("holaaaaa");

    const tournament = await TournamentModel.findById(job.attrs.data.id);
    
    if (tournament.started) {
      done();
    } else {


      const finishDate = new Date(
        (tournament.startDate.getTime() +
          tournament.finishDate.getTime()) /
          2
      );

      let competition = {
        tournament_id: tournament._id,
        startDate: tournament.startDate,
        finishDate: finishDate
      };
      competition = await CompetitionModel.add(competition);
      //GET ALL INSCRIPTIONS
      const inscriptions = await InscriptionModel.findInscriptionsByTournament(
        tournament._id
      );

      let arrayLevels = ["1", "2", "3"];
      let arrayGender = ["MAN", "WOMAN", "MIXED"];
      try {
        arrayLevels.forEach(level => {
          arrayGender.forEach(async gender => {
            let m1 = inscriptions.filter(item => {
              return item.category == level && item.gender == gender;
            });
            let numberPeopleGroup = m1.length;
            console.log(gender+ " " + numberPeopleGroup);

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
            } else {
              if (numberPeopleGroup > 12 && numberPeopleGroup < 16) {
                for (let i = 12; i < numberPeopleGroup; i++) {
                  const removeIns = m1.shift();
                }
                numberPeopleGroup = m1.length;
              }

              //SUBGROUPS
              let maxDiv = 0;
              let minDiv = 12;
              let maxRes = 0;
              let minRes = 12;
              let chosen = 0;
              let chosenRen = 0;
              let stop = false;
              let i = 12;

              while (i > 7 && !stop) {
                if (numberPeopleGroup % i == 0) {
                  stop = true;
                  chosen = i;
                } else {
                  let res = numberPeopleGroup % i;
                  if (res > maxRes) {
                    maxDiv = i;
                    maxRes = res;
                  }
                  if (res < minRes && i + res < 13) {
                    minDiv = i;

                    minRes = res;
                  }
                }
                i--;
              }
              //ES UN GRUPO PERFECTO
              let dataArray = [];
              if (stop) {
                for (let j = 0; j < numberPeopleGroup; j++) {
                  let data = {};
                  data.tournament_id = tournament._id;
                  data.user1_id = m1[j].user1_id;
                  data.user2_id = m1[j].user2_id;
                  data.group = m1[j].category.toString() + m1[j].gender;
                  data.subGroup = Math.floor(j / chosen);
                  dataArray.push(data);
                }
              } else {
                let numG;
                //SIGNIFICA QUE PUEDE HABER UN GRUPO DE RESTO ENTRE 8 Y 12
                if (maxRes > 7 && maxRes < 13) {
                  chosen = maxDiv;
                  choseRen = maxRes;
                  numG = Math.floor(numberPeopleGroup / chosen);
                } else {
                  chosen = minDiv;
                  chosenRen = minDiv + minRes;
                  numG = Math.floor(numberPeopleGroup / chosen) - 1;
                }

                for (let j = 0; j < numG; j++) {
                  for (let z = 0; z < chosen; z++) {
                    let data = {};
                    data.tournament_id = tournament._id;
                    data.user1_id = m1[z].user1_id;
                    data.user2_id = m1[z].user2_id;
                    data.group = m1[z].category.toString() + m1[z].gender;
                    data.subGroup = j;
                    dataArray.push(data);
                  }

                  m1.splice(0, chosen);
                }
                for (let j = 0; j < chosenRen; j++) {
                  let data2 = {};

                  data2.tournament_id = tournament._id;
                  data2.user1_id = m1[j].user1_id;
                  data2.user2_id = m1[j].user2_id;
                  data2.group = m1[j].category.toString() + m1[j].gender;
                  data2.subGroup = numG;
                  dataArray.push(data2);
                }
              }
              let addedGroup = [];
              addedGroup = await Promise.all(dataArray.map(async item=>{
                  const group = await GroupModel.add(item);
                  return group;
              }));
              /*dataArray.forEach(item => {
                console.log("si");
                GroupModel.add(item).then(group => {
                  addedGroup.push(group);
                });
              });*/

              let clasification = {
                competition_id: competition._id,
                points: 0
              };
              let hashSubGroups = {};

              addedGroup.forEach(async item => {
                if (!hashSubGroups[item.subGroup]) {
                  let arr = [];
                  arr.push(item);
                  hashSubGroups[item.subGroup] = arr;
                } else {
                  hashSubGroups[item.subGroup].push(item);
                }
                clasification.user1_id = item.user1_id;
                clasification.user2_id = item.user2_id;
                clasification.subGroup = item.subGroup;
                clasification.category = level + gender;

                await ClasificationModel.add(clasification);
              });


              for (let key in hashSubGroups) {
                const arrSubGroups = hashSubGroups[key];


                let clash = {
                  competition_id: competition._id
                };

                for (let z = 0; z < arrSubGroups.length - 1; z++) {
                  for (let w = z + 1; w < arrSubGroups.length; w++) {
                    clash.user1_id = hashSubGroups[key][z].user1_id;
                    clash.user2_id = hashSubGroups[key][z].user2_id;
                    clash.user3_id = hashSubGroups[key][w].user1_id;
                    clash.user4_id = hashSubGroups[key][w].user2_id;

                    await ClashModel.add(clash);
                  }
                }
              }

              TournamentModel.update(tournament._id, {
                $set: { started: true }
              });
            }
          });
        });
        job.remove(err => {
          console.log(err);
        });
        done();
      } catch (err) {
        job.remove(err => {
          console.log(err);
        });
        done();
      }
      //FILTER BY CATEGORY
    }
  });
};
