const BlogModel = require("../models/BlogModel");
const UserModel = require("../models/UserModel");

class BlogController {
  constructor() {}

  async showAll(req, res) {
    const posts = await BlogModel.findAll();
    res.render("blog/showAll", { posts: posts, user: req.user});
  }

  async show(req, res) {
    const blog = await BlogModel.findById(req.params.id);
    res.render("blog/showCurrent", { blog: blog, user: req.user});
  }

  async add(req, res) {
    if (req.method == "GET") {
      const user = await UserModel.findById(req.user.id);
      console.log(user);
      res.render("blog/add",{user: user});
    } else {
      try {
        const user = await UserModel.findById(req.user.id);
        const dateNow = Date.now();
        let data = {
          title: req.body.title,
          body: req.body.body,
          date: dateNow,
          author: user.name
        };
        console.log("No se añadio");
        const blog = await BlogModel.add(data);
        console.log("añadido");
        return res.redirect("/blog");
      } catch (err) {
        req.flash("error","Error al insertar el post");
        res.redirect("/blog");
      }
    }
  }

  async edit(req, res) {
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (req.method == "GET") {
        res.render("blog/edit", { blog: blog ,user: req.user});
      } else {
        const newData = { $set: req.body };
        await BlogModel.update(blog._id, newData);
        return res.redirect('/blog');
      }
    } catch (err) {
        req.flash("error", "Error al editar el post");
        res.redirect("/blog");
    }
  }

  async delete(req,res){
    try{
      await BlogModel.delete(req.params.id);
      return res.redirect('/blog');
    }catch(err){
      req.flash("error","Error al borrar el post");
      res.redirect("/blog");
    }
  }
}

module.exports = new BlogController();