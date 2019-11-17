const PromotedInscription = require("../models/PromotedInscription");

class PromotedInscriptionModel {
  constructor() {}

  findById(id) {
    return PromotedInscription.findById(id);
  }
  findMyInscriptions(id) {
    return PromotedInscription.find({ user_id: id });
  }

   async findIfImAlreadyInscripted(data) {
    return await PromotedInscription.countDocuments(data);

  }
  findInscriptionsByGame(id){
    return PromotedInscription.find({promoted_id:id});
  }

  async add(body) {
    let promotedInscription = new PromotedInscription(body);
    try {
      return await promotedInscription.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return PromotedInscription.deleteOne({ _id: id });
  }

  deleteUser(promoted_id,user_id) {
    return PromotedInscription.deleteOne({ promoted_id: promoted_id, user_id: user_id });
  }
}

module.exports = new PromotedInscriptionModel();
