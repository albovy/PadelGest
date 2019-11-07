const Inscription = require("../models/Inscription");

class InscriptionModel {
  constructor() {}

  findById(id) {
    return Inscription.findById(id);
  }
  findMyInscriptions(id) {
    return Inscription.find({ $or: [{ user1_id: id }, { user2_id: id }] });
  }

   findIfImAlreadyInscripted(tournament_id, user_id) {
    return Inscription.countDocuments({$and :[{$or :[{user1_id : user_id},{user2_id: user_id}]},{tournament_id : tournament_id}]});
  }
  

  findInscriptionsByTournament(id) {
    return Inscription.find({ tournament_id: id }).sort({inscriptionDate: -1});
  }
  async add(body) {
    let inscription = new Inscription(body);
    console.log(inscription);
    try {
      return await inscription.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }
  delete(id) {
    return Inscription.deleteOne({ _id: id });
  }
}

module.exports = new InscriptionModel();
