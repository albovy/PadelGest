const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InscriptionSchema = new Schema({
  user1_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  user2_id: { type: Schema.Types.ObjectId, required: true, ref: "User"},
  tournament_id: { type: Schema.Types.ObjectId, required: true, ref: "Tournament"},
  category: { type: Number, required: true },
  inscriptionDate: { type: Date, required: true }
});

module.exports = mongoose.model("Inscription", InscriptionSchema);
