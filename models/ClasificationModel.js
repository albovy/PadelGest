const Clasification = require("../models/Clasification");

class ClasificationModel{
    constructor(){}

    findByCatAndCompSub(idComp,cat,sub){
        return Clasification.find({category:cat,competition_id : idComp,subGroup:sub}).sort({points:-1});
    }

    findByCompAndUser(idComp,idUser){
        return Clasification.findOne({ $or: [{ user1_id: idUser }, { user2_id: idUser }, { user3_id: idUser }, { user4_id: idUser }],competition_id: idComp })
    }


    async add(body){
        let clasification = new Clasification(body);
        try{
            return await clasification.save();
        }catch(err){
            return await new Promise((resolve, reject) => reject(err));
        }
    }

  async update(id, data) {
    try {
      const clasification = await Clasification.updateOne({ _id: id }, data);
      return clasification;
    } catch (err) {
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