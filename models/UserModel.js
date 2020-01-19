const User = require("../models/User");

class UserModel {
  constructor() {}

  findOne(login) {
    return User.findOne({ login: login });
  }

  async save(body) {
    let user = new User(body);
    try {
      const user_1 = await user.save();
      return user_1;
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  findAll() {
    return User.find();
  }

  findById(id) {
    return User.findById(id);
  }

  findNumByGender(){
    let numMen = User.count({role: "ATHLETE", gender: "MAN"});
    let numWomen = User.count({role: "ATHLETE", gender: "WOMAN"});
    return {"men":numMen, "women":numWomen};
  }

  async update(id, data) {
    try {
      const user = await User.updateOne({ _id: id }, data);
      return user;
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return User.deleteOne({ _id: id });
  }
}

module.exports = new UserModel();
