const PrivateCoachingModel = require("../models/PrivateCoachingModel");
const PrivateCoachingInscriptionModel = require("../models/PrivateCoachingInscriptionModel");
const UserModel = require("../models/UserModel");

class PrivateCoachingController {
  constructor() { }

  async add(req, res) {
    if (req.method == "GET") {
      res.render("privateCoaching/add", { user: req.user });
    } else {
      try {
        const startDate = new Date(new Date(req.body.date).getTime()); //data inicio ya formateada
        const time = req.body.time;

        startDate.setHours(parseInt(time.split(":")[0]) + 1);
        startDate.setMinutes(time.split(":")[1]);
        let data = {
          title: req.body.title,
          date: startDate,
          description: req.body.description,
          coach: req.user.id
        };
        const privC = await PrivateCoachingModel.add(data);
        return res.redirect("/privateCoaching");
      } catch (err) {
        req.flash("error", "Error al insertar su clase particular");
        res.redirect("/privateCoaching");
      }
    }
  }

  async delete(req, res) {
    try {
      await PrivateCoachingModel.delete(req.params.id);

      const getInscripted = await PrivateCoachingInscriptionModel.findInscriptionsByCoaching(
        req.params.id
      );
      getInscripted.forEach(async elemnt => {
        await PrivateCoachingInscriptionModel.delete(elemnt._id);
      });
      return res.redirect("/privateCoaching");
    } catch (err) {
      req.flash("error", "Error al borrar su clase particular");
      res.redirect("/privateCoaching");
    }
  }

  async showAll(req, res) {
    const privCoach = await PrivateCoachingModel.findAll();

    const dateNow = Date.now();
    let creators = [];
    let array = [];
    array = await Promise.all(
      privCoach.map(async element => {
        if (element.date < dateNow) {
          try {
            await PrivateCoachingModel.delete(element._id);
            const getInscripted = await PrivateCoachingInscriptionModel.findInscriptionsByCoaching(
              element._id
            );

            getInscripted.forEach(async elemnt => {
              await PrivateCoachingInscriptionModel.delete(elemnt._id);
            });
          } catch (err) {
            req.flash(
              "error",
              "Las clases pueden no estarse mostrando correctamente."
            );
            res.redirect("/privateCoaching");
          }
        } else {
          let options = {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          };


          let creator = await UserModel.findById(element.coach);

          if (creators.length === 0) {
            creators.push(creator);
          }

          let isRepeated = false;

          creators.forEach(async elemnt => {
            if (elemnt.login === creator.login) {
              isRepeated = true;
            }
          })

          if (isRepeated === false) {
            creators.push(creator);
          }

          element.date.setHours(element.date.getHours() - 1);
          let data = {
            _id: element._id,
            title: element.title,
            date: element.date.toLocaleDateString("es-ES", options),
            description: element.description,
            coach: element.coach,

          };
          let cont = await PrivateCoachingInscriptionModel.findIfImAlreadyInscripted({
            privateCoaching_id: data._id,
            user_id: req.user.id
          });
          if (cont > 0) {
            data.inscripted = true;
          }

          return data;
        }
      })
    );
    res.render("privateCoaching/showAll", { privCoach: array, user: req.user, creators: creators });
  }

  async showCoachInscriptions(req, res) {
    const coachPrivateCoaching = await PrivateCoachingModel.findAllByCoach(
      req.user.id
    );
    let creators = [];
    let array = await Promise.all(
      coachPrivateCoaching.map(async element => {

        const privCoachId = element._id;
        let privateCoaching = await PrivateCoachingModel.findById(privCoachId);
        privateCoaching.date.setHours(privateCoaching.date.getHours() - 1);
        let options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        };

        let data = {
          _id: privateCoaching._id,
          title: privateCoaching.title,
          date: privateCoaching.date.toLocaleDateString("es-ES", options),
          description: privateCoaching.description,
          coach: req.user
        };
        return data;
      })
    );
    let array2 = array.filter(element => element != null);
    res.render("privateCoaching/showCoachInscriptions", {
      coachPrivateCoaching: array2,
      user: req.user
    });
  }

  async showMyInscriptions(req, res) {
    const myPrivateCoachingInscriptions = await PrivateCoachingInscriptionModel.findMyInscriptions(
      req.user.id
    );
    let creators = [];
    let coachings = [];
    let array = await Promise.all(
      myPrivateCoachingInscriptions.map(async element => {
        const privCoachId = element.privateCoaching_id;
        let privateCoaching = await PrivateCoachingModel.findById(privCoachId);
        privateCoaching.date.setHours(privateCoaching.date.getHours() - 1);
        let options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        };
       

        let data = {
          _id: privateCoaching._id,
          title: privateCoaching.title,
          date: privateCoaching.date.toLocaleDateString("es-ES", options),
          description: privateCoaching.description,
          coach: req.user
        };
        return data;
      })
    );

    let array2 = array.filter(element => element != null);;
    res.render("privateCoaching/showInscriptions", {
      myPrivateCoachingInscriptions: array2,
      user: req.user,
    });
  }
}

module.exports = new PrivateCoachingController();
