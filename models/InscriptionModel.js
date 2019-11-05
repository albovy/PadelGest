const Inscription = require("../models/Inscription");

class InscriptionModel {
  constructor() {}

  findById(id) {
    return Inscription.findById(id);
  }
  findMyInscriptions(id) {
    return Inscription.find({ $or: [{ user1_id: id }, { user2_id: id }] });
  }
  async add(body) {
    let inscription = new Inscription(body);
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
