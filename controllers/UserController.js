const UserModel = require("../models/UserModel");

class UserController {
  constructor() {}

  async showAll(req, res) {}
  async register(req, res) {
    if (!req.cookies.token) {
      if (req.method == "GET") {
        res.render("user/register");
      } else {
        try {
          const user = await UserModel.save(req.body);
          console.log(user);
          return res.redirect("/auth");
        } catch (err) {
          return console.log(err);
        }
      }
    }else{
      res.redirect("/");
    }
  }
}

module.exports = new UserController();
