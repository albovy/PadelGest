const User = require("../models/User");


class UserModel {
  constructor() {}

  findOne(login) {
    return User.findOne({ login: login });
  }

  save(body) {
    let user = new User(body);
    return user
      .save()
      .then(user => user)
      .catch(err => new Promise((resolve, reject) => reject(err)));
  }

}

module.exports = new UserModel();
