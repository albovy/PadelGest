const CompetitionModel = require("../../models/CompetitionModel");
const TournamentModel = require("../../models/TournamentModel");
const GroupModel = require("../../models/GroupModel");
const ClasificationModel = require("../../models/ClasificationModel");
const ClashModel = require("../../models/ClashModel");

module.exports = function(agenda) {
  agenda.define("run playoff", async function(job, done) {
    const competitionSeason = await CompetitionModel.findById(
      job.attrs.data.id
    );

    const tournament = await TournamentModel.findById(
      competitionSeason.tournament_id
    );
    if (tournament.type == "REGULARLEAGUE") {
      let competitionPlayOff = {
        tournament_id: tournament._id,
        type: "PLAYOFF",
        startDate: competitionSeason.finishDate,
        finishDate: tournament.finishDate
      };
      TournamentModel.update(tournament._id, { $set: { type: "PLAYOFF" } });
      competitionPlayOff = await CompetitionModel.add(competitionPlayOff);
      let arrayLevels = ["1", "2", "3"];
      let arrayGender = ["MAN", "WOMAN", "MIXED"];
      let clasification ={
        competition_id :competitionPlayOff._id,
        points:0
      };
      arrayLevels.forEach(level => {
        arrayGender.forEach(async gender => {
          const sub = await GroupModel.countDistinctSubgroup(
            tournament._id,
            level + gender
          );

          sub.forEach(async subgroup => {
            let clasifications = await ClasificationModel.findByCatAndCompSub(
              competitionSeason._id,
              level + gender,
              subgroup
            );
            let j = 7;
            let clash = {
              competition_id: competitionPlayOff._id
            };
            for (let i = 0; i < 4; i++) {
              console.log(i + " contra " + j);

              let iGroup = await GroupModel.findByUserAndTournament(
                clasifications[i].user1_id,
                tournament._id
              );
              await GroupModel.update(iGroup._id, {
                $set: { clasificated: true }
              });
              clasification.user1_id = iGroup.user1_id;
              clasification.user2_id = iGroup.user2_id;
              clasification.subGroup = iGroup.subGroup;
              clasification.category = level+gender;

              await ClasificationModel.add(clasification);

              let jGroup = await GroupModel.findByUserAndTournament(
                clasifications[j].user1_id,
                tournament._id
              );
              await GroupModel.update(jGroup._id, {
                $set: { clasificated: true }
              });
              clasification.user1_id = jGroup.user1_id;
              clasification.user2_id = jGroup.user2_id;
              clasification.subGroup = jGroup.subGroup;
              clasification.category = level+gender;

              await ClasificationModel.add(clasification);

              clash.user1_id = iGroup.user1_id;
              clash.user2_id = iGroup.user2_id;
              clash.user3_id = jGroup.user1_id;
              clash.user4_id = jGroup.user2_id;

              await ClashModel.add(clash);
              console.log(iGroup);
              console.log(jGroup);

              j--;
            }
          });
        });
      });
    }

    job.remove(err => {
      console.log(err);
    });
    done();
  });
};
