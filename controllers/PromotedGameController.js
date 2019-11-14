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

    let array = await Promise.all(
      myPromotedInscriptions.map(async element => {
        const promoid = element.promoted_id;
        const game = await PromotedGameModel.findById(promoid);
        return game;
      })
    );
    let array2 = array.filter(element => element !=null);
    console.log(array2);

    res.render("promoted/showInscriptions", {
      myPromotedInscriptions: array2,
      user: req.user
    });
  }

  async showAll(req, res) {
    const promos = await PromotedGameModel.findAll();
    const dateNow = Date.now();
    let array = [];
    array = await Promise.all(promos.map(async element => {
      if (element.date < dateNow) {
        try {
          await PromotedGameModel.delete(element._id);
          const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(
            element._id
          );
          getInscripted.forEach(async elemnt => {
            await PromotedInscriptionModel.delete(elemnt._id);
          });
        } catch (err) {
          console.log("F");
          req.flash(
            "error",
            "Los partidos pueden no estarse mostrando correctamente."
          );
          res.redirect("/promoted");
        }
      } else {
        let data = {
          _id: element._id,
          title: element.title,
          date: element.date,
          numPlayers: element.numPlayers
        };
        let cont = await PromotedInscriptionModel.findIfImAlreadyInscripted({
          promoted_id: data._id,
          user_id: req.user.id
        });
        if (cont > 0) {
          data.inscripted = true;
        }
        return data;
      }
    })
    );
    console.log(array);
    res.render("promoted/showAll", { promos: array, user: req.user });
  }
  async add(req, res) {
    if (req.method == "GET") {
      res.render("promoted/add",{user:req.user});
    } else {
      try {
        const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
        const time = req.body.time;

        startDate.setHours(parseInt(time.split(":")[0]) + 1);
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
      const getInscripted = await PromotedInscriptionModel.findInscriptionsByGame(
        req.params.id
      );
      getInscripted.forEach(async elemnt => {
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
