const UserModel = require("../models/UserModel");
const nodemailer = require('nodemailer');

class UserController {
  constructor() {}

  async showAll(req, res) {
    const users = await UserModel.findAll();
    res.render("user/showAll", { users: users });
  }
  async register(req, res) {
    if (req.method == "GET") {
      res.render("user/register");
    } else {
      try {
        const user = await UserModel.save(req.body);
        console.log(user);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: 'padelgest2020@gmail.com',
            pass: 'padel20gest'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        const message = {
          from: 'padelgest2020@gmail.com',
          to: req.body.email,
          subject: 'Registro completado',
          html: '<p>Te has registrado en PadelGest, ya puedes acceder a todas nuestras actividades desde nuestro sitio Web.</p><p>Un saludo, el equipo de PadelGest.</p>'
        };
        transporter.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
        });
        return res.redirect("/auth");
      } catch (err) {
        req.flash("error", "Error en el registro");
        res.redirect("/");
      }
    }
  }

  async edit(req, res) {
    if (req.user.role == "ADMIN" || req.user.id == req.params.id) {
      try {
        console.log(req.params.id);
        const user = await UserModel.findById(req.params.id);
        console.log(user);
        if(user == null)throw err;
        console.log(user);
        if (req.method == "GET") {
          console.log("hola");
          console.log(user);
          res.render("user/edit", { user: user });
        } else {
          const newData = { $set: { name: req.body.name,email: req.body.email, gender:req.body.gender} };
          console.log(newData);
          try {
            const newUser = await UserModel.update(user._id, newData);
            console.log(newUser);
            return res.redirect("/");
          } catch (err) {
            req.flash("error", "Error en al actualizar el usuario");
            res.redirect("/");
          }
        }
      } catch(err) {
        req.flash("error", "Error al editar el usuario");
        res.redirect("/");
      }
    } else {
      return res.status(401); //No autorizado
    }
  }

  async delete(req,res){
    try{
      await UserModel.delete(req.params.id);
      console.log("ok");
      res.redirect("/user");
    }catch(err){
      req.flash("error", "Error al borrar el usuario");
      res.redirect("/");
    }
  }

  async add(req,res){
    if(req.method == "GET"){
      res.render("user/add",{user:req.user});
    }else{
      try {
        const user = await UserModel.save(req.body);
        console.log(user);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: 'padelgest2020@gmail.com',
            pass: 'padel20gest'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        const message = {
          from: 'padelgest2020@gmail.com',
          to: req.body.email,
          subject: 'Registro completado',
          html: '<p>Te has registrado en PadelGest, ya puedes acceder a todas nuestras actividades desde nuestro sitio Web.</p><p>Un saludo, el equipo de PadelGest.</p>'
        };
        transporter.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
        });
        return res.redirect("/");
      } catch (err) {
        req.flash("error", "Error en el registro");
        res.redirect("/");
      }
    }
  }
}

module.exports = new UserController();
