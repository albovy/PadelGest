const Tournament = require("../models/Tournament");

class TournamentModel {
  constructor() {}

  findAll() {
    return Tournament.find();
  }
  findById(id){
      return Tournament.findById(id);
  }

  async add(body) {
    let tournament = new Tournament(body);
    try {
      return await tournament.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  async update(id, data) {
    try {
      const tournament = await tournament.updateOne({ _id: id }, data);
      return Tournament;
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    //AÑADIR EL BORRADO ENCADENACION
    return Tournament.deleteOne({ _id: id });
  }

  
}

module.exports = new TournamentModel();
