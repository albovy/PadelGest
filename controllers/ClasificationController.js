const CompetitionModel = require("../models/CompetitionModel");
const GroupModel = require("../models/GroupModel");
const ClasificationModel = require("../models/ClasificationModel");
const InscriptionModel = require("../models/InscriptionModel");
const UserModel = require("../models/UserModel");

class ClasificationController {
  constructor() {}

  async showClasificationTournmanet(req, res) {
    const comp = await CompetitionModel.findByTournament(req.params.id);

    const inscription = await InscriptionModel.findMyInscriptionInTournament(
      req.params.id,
      req.user.id
    );
    const group = await GroupModel.findByUserAndTournament(
      req.user.id,
      req.params.id
    );
    console.log(group);
    const cat = inscription.category.toString() + inscription.gender;
    const clasifications = await ClasificationModel.findByCatAndCompSub(
      comp._id,
      cat,
      group.subGroup
    );
    console.log(clasifications);
    let array = [];
    array = await Promise.all(clasifications.map(async element=>{
      const user1 = await UserModel.findById(element.user1_id)
      const user2 = await UserModel.findById(element.user1_id);
        let data={
          _id: element._id,
          competition_id: element.competition_id,
          user1_id: user1.login,
          user2_id: user2.login,
          category: element.category,
          subGroup: element.subGroup,
          points: element.points
        }
        return data
    })
    );

    console.log(array);
    res.render("clasification/showClasification", {
      clasifications: array,
      user: req.user
    });
  }
}

module.exports = new ClasificationController();
