const Clasification = require("../models/Clasification");

class ClasificationModel{
    constructor(){}

    //Devuelve todas las clasificaciones de una pareja/equipo
    findByTeam(userId, user2Id){
        return Clasification.find({
            user1_id: userId,
            user2_id: user2Id
        });
    }

    async add(body){
        let clasification = new Clasification(body);
        try{
            return await clasification.save();
        }catch(err){
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id){
        return Clasification.deleteOne({
            _id: id
        });
    }
}

module.exports = new ClasificationModel();