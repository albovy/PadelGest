const Game = require("../models/Game");

class GameModel{
    constructor(){}

    findById(id){
        return Game.findById({_id: id});
    }

    findByClash(clashId){
        return Game.findOne({clash_id: clashId});
    }

    async add(body){
        console.log("addGameModel");
        let game = new Game(body);
        try{
            return await game.save();
        }catch(err){
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id){
        return Game.deleteOne({_id: id});
    }

  async update(id, data) {
    try {
      const game = await Game.updateOne({ _id: id }, data);
      return game;
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }
}

module.exports = new GameModel();