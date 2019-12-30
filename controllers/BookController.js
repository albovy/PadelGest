const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const PayoutModel = require("../models/PayoutModel");
const UserModel = require("../models/UserModel");

//FALTA INTRODUCIR RENDER VISTAS (comentarios comenzando por INTRO render)
class BookController {
  constructor() {}

  async show(req, res) {
    console.log("showBook");
    const myBooks = await BookModel.findMyBooks(req.user.id); //ver reservas de un deportista
    //Ahora mismo se muestra el id de la pista al user como identificador de la reserva
    let array = [];
    array = await Promise.all(
      myBooks.map(async element => {
        if (element.startDate > Date.now()) {
          console.log(element);
          const pista = await CourtModel.findById(element.court_id);
          console.log(pista);
          let options ={
            weekday:"long",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"
          };
          element.startDate.setHours(element.startDate.getHours()-1);
          let data = {
            _id: element._id,
            user_id: element.user_id,
            court_id: pista.name,
            startDate: element.startDate.toLocaleDateString("es-ES",options)
          };
          return data;
        }
      })
    );
    res.render("book/showMyBooks", { myBooks: array, user: req.user });
  }

  async add(req, res) {
    if (req.method == "GET") {
      //Lanza vista con las fechas disponibles
      try {
        const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange();
        console.log("holaa");
        const numCourts = await CourtModel.countCourts();
        const user = await UserModel.findById(req.user.id);
        let prize = 12;
        if(user.member==true){
          prize = 12*0.7;
          prize = prize.toFixed(2);
        }

        let arrayDatesFullBooked = await Promise.all(
          atLeastOneBookDates.map(async startDate => {
            const numResults = await BookModel.countBooksOnDate(startDate);
            console.log(numResults);
            console.log(numCourts);
            if (numResults == numCourts) {
              console.log("hola");
              return new Date(startDate).getTime() - 3600000;
            }
          })
        );

        console.log(arrayDatesFullBooked);

        res.render("book/add", {
          arrOcuped: arrayDatesFullBooked,
          user: user,
          amount: prize
        }); //numPistas
      } catch (err) {
        console.log("Error getADDBook: ", err);
        req.flash("error", "Error al procesar su reserva");
      }
    } else {
      //Añade una reserva concreta
      try {
        console.log("Dentro addBookController");
        const dateNow = Date.now();

        const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
        const time = req.body.time;
        console.log(startDate);

        startDate.setHours(parseInt(time.split(":")[0]) + 1);
        console.log(startDate);
        startDate.setMinutes(time.split(":")[1]);
        console.log(startDate);

        if (startDate < dateNow) {
          req.flash("error", "No es posible reservar esta franja de tiempo");
          return res.redirect("/book"); //redireccion a la vista show
        }

        const booksOnDate = await BookModel.findByDate(startDate); //reservas en date

        const arrOcuped = [];
        booksOnDate.forEach(element => {
          arrOcuped.push(element.court_id);
        });

        const courtsAvailable = await CourtModel.findNotInRange(arrOcuped); //pistas disponibles(Array de JSONs)
        //Comprobacion para ver si el array esta vacio
        if (courtsAvailable.length == 0) {
          req.flash("error", "No hay pistas libres en la hora especificada");
          return res.redirect("/book"); //redireccion a la vista show
        }

        //Ver que devuelve mongoDB en una consulta vacia
        const courtAv = courtsAvailable[0]._id; //id pista disponible

        const endDate = new Date(
          new Date(new Date(startDate).getTime() + 5400000)
        ); //startDate + 90min
        
        //Recuperamos datos de req
        //$SESSION = req.user.id
        let data = {
          user_id: req.user.id,
          court_id: courtAv,
          startDate: startDate,
          endDate: endDate
        };
        
        let payData = {
          user_id: req.user.id,
          billingAddress: req.body.billingAddress,
          creditCard: req.body.creditCard,
          amount: req.body.amount,
          concept: req.body.concept,
          date: dateNow
        };
        //let user = UserModel.findOne(req.user.id);
        //console.log(user);
        console.log(payData);
        const book = await BookModel.add(data);
        const pay = await PayoutModel.add(payData);
        console.log(pay);
        return res.redirect("/book");
      } catch (err) {
        console.log("Error addBookController");
        req.flash(
          "error",
          "Se ha encontrado un error al insertar la reserva :("
        );
        return res.redirect("/book");
      }
    }
  }
  async delete(req, res) {
    try {
      console.log("deleteBook");
      await BookModel.delete(req.params.id); //ver router /:id
      console.log("pos-deleteBook");
      res.redirect("/book");
    } catch (err) {
      console.log("Error deleteBookController");
      req.flash("error", "Error al borrar su reserva");
      res.redirect("/book");
    }
  }
}

module.exports = new BookController();
