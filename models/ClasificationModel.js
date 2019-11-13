const Clasification = require("../models/Clasification");

class ClasificationModel{
    constructor(){}

    findByCatAndCompSub(idComp,cat,sub){
        return Clasification.find({category:cat,competition_id : idComp,subGroup:sub}).sort({points:-1});
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