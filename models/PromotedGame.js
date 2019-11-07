const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromotedGameScheme = new Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  numPlayers: { type: Number, required: true }
});

module.exports = mongoose.model("PromotedGame", PromotedGameScheme);