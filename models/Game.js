const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  clash_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Clash"
  },
  court_id: { type: Schema.Types.ObjectId, required: true, ref: "Court" },
  date: { type: Date, required: true },
  set1_team1: { type: Number, required: true, default: 0 },
  set1_team2: { type: Number, required: true, default: 0 },
  set2_team1: { type: Number, required: true, default: 0 },
  set2_team2: { type: Number, required: true, default: 0 },
  set3_team1: { type: Number, required: true, default: 0 },
  set3_team2: { type: Number, required: true, default: 0 },
  total_team1: { type: Number, required: true, default: 0 },
  total_team2: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model("Game", GameSchema);
