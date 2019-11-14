const PromotedGame = require("../models/PromotedGame");

class PromotedGameModel {
    constructor() {}

    async findAll(){
        return await PromotedGame.find();
    }
    findById(id){
        return PromotedGame.findById(id);
    }
    
    async incrementNumPlayers(id, data){
        return await PromotedGame.updateOne({_id: id}, data);
    }

    async edit(id,data){
        return await PromotedGame.updateOne({_id:id},data);
    }

    async add(body) {
        let promo = new PromotedGame(body);
        try {
            return await promo.save();
        } catch (err) {
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id) {
        return PromotedGame.deleteOne({ _id: id });
    }
}

module.exports = new PromotedGameModel();