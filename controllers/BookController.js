const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");

//FALTA INTRODUCIR RENDER VISTAS (comentarios comenzando por INTRO render)
class BookController{
    constructor(){}

    async show(req,res){
        console.log("showBook");
        const myBooks = await BookModel.findByLogin(req.user.id); //ver reservas de un deportista
        //INTRO render vista ---------------
    }
    
    async add(req,res){
       
        if(req.method == "GET"){     //Lanza vista con las fechas disponibles
            try{
                const atLeastOneBookDates = await BookModel.findAllDistinctDatesInRange();
                let arrayDatesFullBooked = [];  //Array con las fechas totalmente reservadas
                const numCourts = CourtModel.countCourts(); //numPistas
                atLeastOneBookDates.forEach(json =>{
                    let numResults = BookModel.countBooksOnDate(json.startDate);
                    if(numResults == numCourts){
                        arrayDatesFullBooked.add(json.startDate);
                    }
                });
                console.log("arrayDatesFullBooked :");
                console.log(arrayDatesFullBooked);
                //RENDER
                res.render("book/add");
            }catch(err){
                console.log("Error getADDBook: ", err);
            }
           
        }else{   //Añade una reserva concreta
            try{
                console.log("Dentro addBookController");
                const dateNow = Date.now();
                const desiredDate = req.body.date;  //fecha deseada
                if(desiredDate < dateNow){
                    throw  err;

                }

                const booksOnDate = await BookModel.findByDate(desiredDate);    //reservas en date
                console.log(booksOnDate);
                const arrOcuped = [];
                 booksOnDate.forEach(element => {
                    arrOcuped.add(element.court_id);
                });
                
                const courtsAvailable = await CourtModel.findNotInRange(arrOcuped);   //pistas disponibles(Array de JSONs)
                console.log(courtsAvailable + "jajajajajajaj");
                //Comprobacion para ver si el array esta vacio
                if(courtsAvailable.length == 0){
                   
                    throw  err;
                    //Redireccion

                }
                               
                //Ver que devuelve mongoDB en una consulta vacia
                const courtAv = courtsAvailable[0]._id;  //id pista disponible
                const startDate = new Date(new Date(req.body.startDate).getTime()); //data inicio ya formateada
                console.log(startDate);
                const endDate = new Date(new Date(new Date(startDate).getTime()+5400000));      //startDate + 90min
                console.log(endDate);
                console.log(req.user.id);
                console.log(courtAv);
                
                //Recuperamos datos de req
                //$SESSION = req.user.id
                let data = {
                    user_id: req.user.id,
                    court_id: courtAv,
                    startDate: startDate,
                    endDate: endDate,
                }
                console.log(data);
                const book = await BookModel.add(data);
                console.log(book);
    
    
            }catch(err){
                //Falta tratamiento errores
                console.log("Error addBookController");
            }
        }
        
    }
    async delete(req,res){
        try{
            console.log("deleteBook");
            await BookModel.delete(req.params.id); //ver router /:id
            console.log("pos-deleteBook");
            res.redirect("/book");
        }catch(err){
            //Falta tratamiento errores
            console.log("Error deleteBookController");
        }
    }
}

module.exports = new BookController();