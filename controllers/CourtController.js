const courtModel = require("../models/CourtModel");

class CourtController {
  constructor() {}

  async showAll(req, res) {
    const courts = await courtModel.findAll();
    res.render("court/showAll", { courts: courts });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("court/add");
    } else {
      try {
        const court = await courtModel.add(req.body);
        return res.redirect("/court");
      } catch (err) {
        req.flash("error","Error al insertar la pista");
        res.redirect("/court");
      }
    }
  }

  async edit(req, res) {
    try {
      const court = await courtModel.findById(req.params.id);
      if (req.method == "GET") {
        res.render("court/edit", { court: court });
      } else {
        const newData = { $set: req.body };
        const newCourt = await courtModel.update(court._id,newData);
         return res.redirect('/court');
      }
    } catch (err) {
        req.flash("error", "Error al editar su pista");
        res.redirect("/court");
    }
  }

  async delete(req,res){
    try{
      await courtModel.delete(req.params.id);
      return res.redirect('/court');
    }catch(err){
      req.flash("error","Error al borrar su pista");
      res.redirect("/court");
    }
  }
}

module.exports = new CourtController();
