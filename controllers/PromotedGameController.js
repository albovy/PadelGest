const PromotedGameModel = require("../models/PromotedGameModel");
const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");

class PromotedGameController {
  constructor() {}

  /*async deleteOutOfDate(id){
    const dateNow = Date.now();
    const game = await PromotedGameModel.findById(id);
    if(game.date<dateNow){
      await this.delete(id);
    }
  }*/

  async showMyInscriptions(req, res) {
    const myPromotedInscriptions = await PromotedInscriptionModel.findMyInscriptions(
      req.user.id
    );
    console.log(myPromotedInscriptions);
    let array = await Promise.all(
      myPromotedInscriptions.map(async element => {
        const promoid = element.promoted_id;
        const game = await PromotedGameModel.findById(promoid);
        return game;
      })
    );


    res.render("promoted/showInscriptions", {
      myPromotedInscriptions: array,
      user: req.user
    });
  }

  async showAll(req, res) {
    const promos = await PromotedGameModel.findAll();
    const dateNow = Date.now();
    let array=[];
    promos.forEach(async element=>{
      if(element.date<dateNow){
        try{
          await PromotedGameModel.delete(element._id);
          const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(element._id);
                    getInscripted.forEach(async elemnt=>{
                        await PromotedInscriptionModel.delete(elemnt._id);
                    });
        }catch(err){
          console.log("F");
          req.flash("error", "Los partidos pueden no estarse mostrando correctamente.");
          res.redirect("/promoted");
        }
      }else{
        array.push(element);
      }
    });
    const myInscriptions = await PromotedInscriptionModel.findMyInscriptions(req.user.id);
        let array2 = [];
        myInscriptions.forEach(element=>{
            array2.push({_id: element.promoted_id});
        });
        //console.log(promos);
        console.log(array);
        res.render("promoted/showAll", { promos: array, user: req.user, inscriptions: array2});
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("promoted/add");
    } else {
      try {
        const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
        const time = req.body.time;
   
        startDate.setHours(parseInt(time.split(":")[0])+1);
        startDate.setMinutes(time.split(":")[1]);
        let data = {
          date: startDate,
          title: req.body.title,
          numPlayers: req.body.numPlayers 
        };
        const promo = await PromotedGameModel.add(data);
        return res.redirect("/promoted");
      } catch (err) {
        req.flash("error", "Error al insertar su partido promocionado");
        res.redirect("/promoted");
      }
    }
  }

  async delete(req, res) {
    try {
      await PromotedGameModel.delete(req.params.id);
      const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(req.params.id);
                    getInscripted.forEach(async elemnt=>{
                        await PromotedInscriptionModel.delete(elemnt._id);
                    });
      return res.redirect("/promoted");
    } catch (err) {
      req.flash("error", "Error al borrar su partido promocionado");
      res.redirect("/promoted");
    }
  }
}

module.exports = new PromotedGameController();
