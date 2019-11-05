const Court = require("../models/Court");

class CourtModel {
    constructor() {}

    findAll(){
        return Court.find();
    }
    findById(id){
        return Court.findById(id);
    }

    async add(body) {
        let court = new Court(body);
        try {
            return await court.save();
        } catch (err) {
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    async update(id, data) {
        try {
            const court = await Court.updateOne({ _id: id }, data);
            return Court;
        } catch (err) {
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id) {
        return Court.deleteOne({ _id: id });
    }
}

module.exports = new CourtModel();