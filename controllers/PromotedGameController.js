const PromotedGameModel = require("../models/PromotedGameModel");
const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");

class PromotedGameController {
  constructor() {}

  deleteOutOfDate(id){
    const dateNow = Date.now();
  }

  async showMyInscriptions(req,res){
    const myPromotedInscriptions = await PromotedInscriptionModel.findMyInscriptions(req.user.id);
    console.log(myPromotedInscriptions);
    let array = await Promise.all(myPromotedInscriptions.map(async element=>{
      const promoid = element.promoted_id;  
      const game = await PromotedGameModel.findById(promoid);
      return game;
    }));
    
    res.render("promoted/showInscriptions", {myPromotedInscriptions : array,user: req.user});
  }


  async showAll(req, res) {
    const promos = await PromotedGameModel.findAll();
    const myInscriptions = await PromotedInscriptionModel.findMyInscriptions(req.user.id);
        let array = [];
        myInscriptions.forEach(element=>{
            array.push({_id: element.promoted_id});
        });
        console.log(promos);
        console.log(array);
        res.render("promoted/showAll", { promos: promos, user: req.user, inscriptions: array});
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
       req.flash("error", "Error al insertar su partido promocionado");
       res.redirect("/promoted");
      }
    }
  }

  async delete(req,res){
    try{
      await PromotedGameModel.delete(req.params.id);
      return res.redirect('/promoted');
    }catch(err){
      req.flash("error", "Error al borrar su partido promocionado");
       res.redirect("/promoted");
    }
  }
}

module.exports = new PromotedGameController();