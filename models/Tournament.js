const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TournamentScheme = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  started: { type: Boolean, required: true, default:false },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Tournament", TournamentScheme);
