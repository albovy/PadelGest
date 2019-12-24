const PrivateCoachingInscription = require("../models/PrivateCoachingInscription");

class PrivateCoachingInscriptionModel {
  constructor() { }

  findById(id) {
    return PrivateCoachingInscription.findById(id);
  }
  findMyInscriptions(id) {
    return PrivateCoachingInscription.find({ user_id: id });
  }

  async findIfImAlreadyInscripted(data) {
    return await PrivateCoachingInscription.countDocuments(data);

  }
  findInscriptionsByCoaching(id) {
    return PrivateCoachingInscription.find({ privateCoaching_id: id });
  }

  async add(body) {
    let privateCoachingInscription = new PrivateCoachingInscription(body);
    try {
      return await privateCoachingInscription.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return PrivateCoachingInscription.deleteOne({ _id: id });
  }

  deleteUser(privateCoaching_id, user_id) {
    return PrivateCoachingInscription.deleteOne({ privateCoaching_id: privateCoaching_id, user_id: user_id });
  }
}

module.exports = new PrivateCoachingInscriptionModel();
