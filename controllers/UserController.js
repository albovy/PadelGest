const UserModel = require("../models/UserModel");

class UserController {
  constructor() {}

  async showAll(req, res) {
    const users = UserModel.findAll();
    const users_2 = await users;
    res.render("user/showAll", { users: users_2 });
  }
  async register(req, res) {
    if (req.method == "GET") {
      res.render("user/register");
    } else {
      try {
        const user = await UserModel.save(req.body);
        console.log(user);
        return res.redirect("/auth");
      } catch (err) {
        return console.log(err);
        //CUBRIR CON ERRORES DE ERROR (visto en internet un 200 OK con un mensaje de error)
      }
    }
  }

  async edit(req, res) {
    if (req.user.role == "ADMIN" || req.user.id == req.params.id) {
      try {
        console.log(req.params.id);
        const user = await UserModel.findById(req.params.id);
        console.log(user);
        if (req.method == "GET") {
          console.log("hola");
          res.render("user/edit", { user: user });
        } else {
          const newData = { $set: { name: req.body.name } };
          try {
            const newUser = await UserModel.update(user._id, newData);
            console.log(newUser);
          } catch (err) {
            return console.log(err);
          }
        }
      } catch {
        //CUBRIR CON ERRORES DE NO ENCONTRADO
      }
    } else {
      //CUBRIR CON ERRORES DE PROHIBICION
    }
  }

  async delete(req,res){
    try{
      await UserModel.delete(req.params.id);
      console.log("ok");
    }catch(err){
      //CUBRIR CON ERRORES NO SE PUEDO BORRAR
    }
  }
}

module.exports = new UserController();
