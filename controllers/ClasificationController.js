const CompetitionModel = require("../models/CompetitionModel");
const TournamentModel = require("../models/TournamentModel");
const GroupModel = require("../models/GroupModel");
const ClasificationModel = require("../models/ClasificationModel");
const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");
const ClashModel = require("../models/ClashModel");

class ClasificationController {
  constructor() {}

  async showClasificationTournmanet(req, res) {
    const torn = await TournamentModel.findById(req.params.id);
    const comp = await CompetitionModel.findByTournament(
      torn._id,
      req.query.type
    );

    const inscription = await InscriptionModel.findMyInscriptionInTournament(
      req.params.id,
      req.user.id
    );
    const group = await GroupModel.findByUserAndTournament(
      req.user.id,
      req.params.id
    );
    if (comp.type == "REGULARLEAGUE") {
      console.log(group);
      const cat = inscription.category.toString() + inscription.gender;
      const clasifications = await ClasificationModel.findByCatAndCompSub(
        comp._id,
        cat,
        group.subGroup
      );
      console.log(clasifications);
      let array = [];
      array = await Promise.all(
        clasifications.map(async element => {
          const user1 = await UserModel.findById(element.user1_id);
          const user2 = await UserModel.findById(element.user2_id);
          let data = {
            _id: element._id,
            competition_id: element.competition_id,
            user1_id: user1.login,
            user2_id: user2.login,
            category: element.category,
            subGroup: element.subGroup,
            points: element.points
          };
          return data;
        })
      );

      console.log(array);
      res.render("clasification/showClasification", {
        clasifications: array,
        user: req.user
      });
    } else {
      const clashes = await ClashModel.countByUserAndCompetition(comp._id,group.user1_id);
      let clasifications = await ClasificationModel.findByCatAndCompSub(
        comp._id,
        group.group,
        group.subGroup
      );
      

      let position = -1;
      clasifications.forEach(clas =>{
        if(clas.user1_id.toString() == group.user1_id.toString()){
          position = clasifications.indexOf(clas);
        }
      });
      console.log(clasifications[0]);
      console.log(req.user);
      console.log(position);

      const gpcla = await GroupModel.countGroupsTournamentAndCatAndSub(comp.tournament_id,group.group,group.subGroup);
      console.log(gpcla);
      res.render("clasification/playoffClasification",{
        user:req.user,
        position:position+1,
        group:group,
        clashes:clashes,
        cant:gpcla
    
      });
      
    }
  }
}

module.exports = new ClasificationController();
