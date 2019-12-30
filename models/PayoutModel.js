const Payout = require("../models/Payout");

class PayoutModel {
    constructor() {}

    async findAll(){
        return await Payout.find();
    }

    findById(id){
        return Payout.findById(id);
    }

    findMyPayouts(id) {
        return Payout.find({ user_id: id });
    }


    async add(body) {
        let pay = await new Payout(body);
        try {
            return await pay.save();
        } catch (err) {
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id) {
        return Payout.deleteOne({ _id: id });
    }
}

module.exports = new PayoutModel();