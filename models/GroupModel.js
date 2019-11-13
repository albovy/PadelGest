const Group = require("../models/Group");

class GroupModel {
  constructor() {}


  findByUserAndTournament(idUser,idTournament){
    return Group.findOne({ $or: [{ user1_id: idUser }, { user2_id: idUser }],tournament_id: idTournament });
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
