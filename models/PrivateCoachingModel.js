const PrivateCoaching = require("../models/PrivateCoaching");

class PrivateCoachingModel {
  constructor() { }

  async findAll() { 
    return await PrivateCoaching.find();
  }

  async findAllByCoach(id) {
    return await PrivateCoaching.find({coach : id});
  }

  findById(id) {
    return PrivateCoaching.findById(id);
  }

  async edit(id, data) {
    return await PrivateCoaching.updateOne({ _id: id }, data);
  }

  async add(body) {
    let PrivCoach = new PrivateCoaching(body);
    try {
      return await PrivCoach.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return PrivateCoaching.deleteOne({ _id: id });
  }
}

module.exports = new PrivateCoachingModel();
