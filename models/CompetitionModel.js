const Competition = require("../models/Competition");

class CompetitionModel {
  constructor() {}

  findAll() {
    return Competition.find();
  }

  findById(id) {
    console.log("find Competition by: ", id);
    return Competition.findById(id);
  }

  findByTournament(idTournament){
    return Competition.find({tournament_id: idTournament});
  }

  async add(body) {
    console.log("addCompetitionModel");
    let competition = new Competition(body);
    try {
      return await competition.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return Competition.deleteOne({
      _id: id
    });
  }
}

module.exports = new CompetitionModel();
