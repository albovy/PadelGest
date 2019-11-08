const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    clash_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Clash"
      },
    date: { type: Date, required: true },
    set1_team1: { type: Number, required: true },
    set1_team2: { type: Number, required: true },
    set2_team1: { type: Number, required: true },
    set2_team2: { type: Number, required: true },
    set3_team1: { type: Number, required: true },
    set3_team2: { type: Number, required: true },
    total_team1: { type: Number, required: true },
    total_team2: { type: Number, required: true }
  });
  
  module.exports = mongoose.model("Game", GameSchema);