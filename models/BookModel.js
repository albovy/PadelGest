const Book = require("../models/Book");

class BookModel {
  constructor() {}

  findById(id) {
    return Book.findById(id);
  }

  findByLogin(login) {
    return Book.find({
      user_id: login
    });
  }
  //Devuelve las reservas de una fecha
  findByDate(date) {
    return Book.find({
      startDate: date
    });
  }

//Devuelve todas las fechas de reserva hasta una fecha limite (sin repetidos)
   findAllDistinctDatesInRange(){
    console.log("findAllDistinct");
    const dateNow = new Date();
    let myToday = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0, 0);
    console.log("myToday: ", Date.now());
    let date = new Date(Date.now());
    console.log(date);
    date.setUTCMinutes(0);
    console.log(date);
    const thresholdDate = new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate()+7, 0, 0, 0);
    console.log("thresholdDate: ",thresholdDate);
    return  Book.distinct("startDate",{startDate: {$gt:myToday, $lt:thresholdDate}} );
  }

  //Funcion que devuelve el numero de reservas para una fecha concreta
  countBooksOnDate(date){
    return Book.count({startDate: date});
  }

  async add(body) {
    
    //body.startDate.setHour(body.startDate.getHour()+1);
    console.log("hola");
    let book = new Book(body);
    try {
      return await book.save();
    } catch (err) {
      return await new Promise((resolve, reject) => reject(err));
    }
  }

  delete(id) {
    return Book.deleteOne({
      _id: id
    });
  }

}

module.exports = new BookModel();