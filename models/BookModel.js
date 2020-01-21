const Book = require("../models/Book");

class BookModel {
  constructor() {}

  findById(id) {
    return Book.findById(id);
  }

  findMyBooks(id) {
    return Book.find({ user_id: id }).sort({ startDate: -1 });
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

  findBooksOnCourtAndDate(court_id,date){
    return Book.countDocuments({court_id:court_id,startDate:{ $gt: date}})
  }

  //Devuelve todas las fechas de reserva hasta una fecha limite (sin repetidos)
  findAllDistinctDatesInRange() {
    console.log("findAllDistinct");
    const dateNow = new Date();

    dateNow.setHours(1, 0, 0, 0);
    console.log(dateNow);

    const thresholdDate = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + 7,
      0,
      0,
      0
    );
    console.log(thresholdDate);
    return Book.distinct("startDate", {
      startDate: { $gt: dateNow, $lt: thresholdDate }
    });
  }

  findAllDistinctDatesInRange2(date1, date2) {
    return Book.distinct("startDate", {
      startDate: { $gt: date1, $lt: date2 }
    });
  }

  //Funcion que devuelve el numero de reservas para una fecha concreta
  countBooksOnDate(date) {
    return Book.countDocuments({ startDate: date });
  }

  async add(body) {
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
