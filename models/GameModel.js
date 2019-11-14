const Game = require("../models/Game");

class GameModel{
    constructor(){}

    findById(id){
        return Game.find({_id: id});
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
}

module.exports = new GameModel();