const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

class AuthController {
  constructor() {}

  async authenticate(req, res) {
    if (!req.user) {
      if (req.method == "GET") {
        res.render("user/login");
      } else {
        let user = UserModel.findOne(req.body.login);

        let valid = user.then(user => {
          if (user) return req.body.passwd == req.body.passwd;
          else throw err;
        });

        try {
          const [user_2, valid_1] = await Promise.all([user, valid]);
          if (valid_1) {
            let payload = {
              id: user_2._id,
              login: user_2.login,
              role: user_2.role
            };

            console.log(user_2);
            const token = jwt.sign(payload, "keyboard cat 4 ever", {
              expiresIn: 129600
            });
            res.cookie("token", token);
            return res.redirect("/");
          } else {
            throw err;
          }
        } catch (err) {
          return res.status(401);
        }
      }
    }else{
      console.log(req.user);
      res.redirect("/");
    }
  }
}

module.exports = new AuthController();
