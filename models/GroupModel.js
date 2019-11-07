const Group = require("../models/Group");

class GroupModel {
  constructor() {}

  findById(id) {
    return Inscription.findById(id);
  }
  
  async add(body) {
    let group = new Group(body);
    try {
      return await group.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }
}

module.exports = new GroupModel();
