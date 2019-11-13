const CompetitionModel = require("../models/CompetitionModel");
const GroupModel = require("../models/GroupModel");
const ClasificationModel = require("../models/ClasificationModel");
const InscriptionModel = require("../models/InscriptionModel");

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

    res.render("clasification/showClasification", {
      clasifications: clasifications,
      user: req.user
    });
  }
}

module.exports = new ClasificationController();
