const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");

//FALTA INTRODUCIR RENDER VISTAS (comentarios comenzando por INTRO render)
class BookController {
  constructor() {}

  async show(req,res){
    console.log("showBook");
    const myBooks = await BookModel.findMyBooks(req.user.id); //ver reservas de un deportista
    //Ahora mismo se muestra el id de la pista al user como identificador de la reserva
    
    res.render("book/showMyBooks", {myBooks : myBooks});
}


  async add(req, res) {
    if (req.method == "GET") {
      //Lanza vista con las fechas disponibles
      try {
        const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange();
        console.log(atLeastOneBookDates);
        const numCourts = await CourtModel.countCourts();

        let arrayDatesFullBooked = await Promise.all(atLeastOneBookDates.map(async startDate => {
          const numResults = await BookModel.countBooksOnDate(startDate);
          console.log(numResults);
          console.log(numCourts);
            if (numResults == numCourts) {
              console.log("hola");
              return new Date(startDate).getTime()-3600000;
            }
        })
        );
        
        console.log(arrayDatesFullBooked);
    
        res.render("book/add", {arrOcuped : arrayDatesFullBooked}); //numPistas

      } catch (err) {
        console.log("Error getADDBook: ", err);
        req.flash("error", "Error al procesar su reserva");
      }
    } else {     
      //Añade una reserva concreta
      try {
        console.log("Dentro addBookController");
        const dateNow = Date.now();
        const desiredDate = req.body.startDate; //fecha deseada

        if (desiredDate < dateNow) {
          req.flash("error","No es posible reservar esta franja de tiempo");
          return res.redirect("/book");   //redireccion a la vista show
        }

        const booksOnDate = await BookModel.findByDate(desiredDate); //reservas en date

        const arrOcuped = [];
        booksOnDate.forEach(element => {
          arrOcuped.add(element.court_id);
        });

        const courtsAvailable = await CourtModel.findNotInRange(arrOcuped); //pistas disponibles(Array de JSONs)
        //Comprobacion para ver si el array esta vacio
        if (courtsAvailable.length == 0) {
          req.flash("error","No hay pistas libres en la hora especificada");
          return res.redirect("/book");   //redireccion a la vista show
        }

        //Ver que devuelve mongoDB en una consulta vacia
        const courtAv = courtsAvailable[0]._id; //id pista disponible
        const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
        const time = req.body.time;
        console.log(startDate);
   
        startDate.setHours(parseInt(time.split(":")[0])+1);
        console.log(startDate);
        startDate.setMinutes(time.split(":")[1]);
        console.log(startDate);

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
        console.log(data);
        const book = await BookModel.add(data);
        console.log(book);
        return res.redirect("/book");
      } catch (err) {
        console.log("Error addBookController");
        req.flash("error","Se ha encontrado un error al insertar la reserva :(");
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
