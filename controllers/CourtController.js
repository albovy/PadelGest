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
        console.log(court);
        return res.redirect("/court");
      } catch (err) {
        return console.log(err);
        //CUBRIR CON ERRORES DE ERROR (visto en internet un 200 OK con un mensaje de error)
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
        //CUBRIR CON ERRORES
    }
  }

  async delete(req,res){
    try{
      await courtModel.delete(req.params.id);
      return res.redirect('/court');
    }catch(err){
      //CUBRIR CON ERRORES NO SE PUEDO BORRAR
    }
  }
}

module.exports = new CourtController();
