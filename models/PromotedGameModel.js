const PromotedGame = require("../models/PromotedGame");

class PromotedGameModel {
    constructor() {}

    findAll(){
        return PromotedGame.find();
    }
    findById(id){
        return PromotedGame.findById(id);
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