const courtModel = require("../models/CourtModel");
const BookModel = require("../models/BookModel");

class CourtController {
  constructor() {}

  async showAll(req, res) {
    const courts = await courtModel.findAll();
    let array = [];
    let today = new Date();

    array = await Promise.all(
      courts.map(async court=>{

        let c = {
          surface: court.surface,
          type: court.type,
          _id: court._id,
          name: court.name
        };
        let l = await BookModel.findBooksOnCourtAndDate(court._id,today);
        
        if(l>0){
          c.book = true;
        }else{
          c.book =false;
        }

        return c;
        


      })
    )

   
    res.render("court/showAll", { courts: array, user: req.user });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("court/add", { user: req.user });
    } else {
      try {
        const court = await courtModel.add(req.body);
        return res.redirect("/court");
      } catch (err) {
        req.flash("error", "Error al insertar la pista");
        res.redirect("/court");
      }
    }
  }

  async edit(req, res) {
    try {
      const court = await courtModel.findById(req.params.id);
      if (req.method == "GET") {
        res.render("court/edit", { court: court, user: req.user });
      } else {
        const newData = { $set: req.body };
        const newCourt = await courtModel.update(court._id, newData);
        return res.redirect("/court");
      }
    } catch (err) {
      req.flash("error", "Error al editar su pista");
      res.redirect("/court");
    }
  }

  async delete(req, res) {
    try {
      await courtModel.delete(req.params.id);
      return res.redirect("/court");
    } catch (err) {
      req.flash("error", "Error al borrar su pista");
      res.redirect("/court");
    }
  }
}

module.exports = new CourtController();
