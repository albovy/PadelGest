const Group = require("../models/Group");

class GroupModel {
  constructor() {}

  findByUserAndTournament(idUser, idTournament) {
    return Group.findOne({
      $or: [{ user1_id: idUser }, { user2_id: idUser }],
      tournament_id: idTournament
    });
  }

  findAllGroupsTournament(idTournament) {
    return Group.find({ tournament_id: idTournament });
  }

  findGroupsTournamentAndCatAndSub(idTournament, idCat, subGroup) {
    return Group.find({
      tournament_id: idTournament,
      group: idCat,
      subGroup: subGroup
    });
  }

  findIfClasificated(idTournament,idUser){
    return Group.find({$or: [{ user1_id: idUser }, { user2_id: idUser }],tournament_id: idTournament,clasificated:true});
  }
  findGroupsTournamentAndCatAndSubClasificated(idTournament, idCat, subGroup) {
    return Group.find({
      tournament_id: idTournament,
      group: idCat,
      subGroup: subGroup,
      clasificated:true
    });
  }
  async countGroupsTournamentAndCatAndSub(idTournament, idCat, subGroup) {
    return Group.countDocuments({
      tournament_id: idTournament,
      group: idCat,
      subGroup: subGroup,
      clasificated: true
    });
  }
  countDistinctSubgroup(idTournament, idCat) {
    return Group.distinct("subGroup", {
      tournament_id: idTournament,
      group: idCat
    });
  }

  distinctCategory(idCompetition) {
    return Group.distinct("group", { tournament_id: idCompetition, clasificated :true});
  }

  async add(body) {
    let group = new Group(body);
    try {
      return await group.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  async update(id, data) {
    try {
      const group = await Group.updateOne({ _id: id }, data);
      return group;
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }
}

module.exports = new GroupModel();
