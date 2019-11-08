const Clash = require("../models/Clash");

class ClashModel{
    constructor(){}

    findById(id){
        return Clash.find({_id: id});
    }

    findByUser(idUser){
        return Clash.find({ $or: [{ user1_id: idUser }, { user2_id: idUser }, {user3_id: idUser}, {user4_id: idUser}] });
    }

    findByUserAndCompetition(idCompetition, idUser){
        return Clash.find({
            $and : [{competition_id: idCompetition}, 
                {$or: [{ user1_id: idUser }, { user2_id: idUser }, {user3_id: idUser}, {user4_id: idUser}]} 
            ]
        });
    }

    async add(body){
        let clash = new Clash(body);
        try{
            return await clash.save();
        }catch(err){
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id){
        return Clash.deleteOne({_id: id});
    }
}

module.exports = new ClashModel();