const PromotedGameModel = require("../models/PromotedGameModel");

class PromotedGameController {
  constructor() {}

  async showAll(req, res) {
    const promos = await PromotedGameModel.findAll();
    res.render("promoted/showAll", { promos: promos });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("promoted/add");
    } else {
      try {
        const promo = await PromotedGameModel.add(req.body);
        console.log(promo);
        return res.redirect("/promoted");
      } catch (err) {
        return console.log(err);
        //CUBRIR CON ERRORES DE ERROR (visto en internet un 200 OK con un mensaje de error)
      }
    }
  }

  async delete(req,res){
    try{
      await PromotedGameModel.delete(req.params.id);
      return res.redirect('/promoted');
    }catch(err){
      //CUBRIR CON ERRORES NO SE PUEDO BORRAR
    }
  }
}

module.exports = new PromotedGameController();