const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompetitionScheme = new Schema({
  tournament_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Tournament"
  },
  type: {
    type: String,
    enum: ["REGULARLEAGUE", "PLAYOFF"],
    default: "REGULARLEAGUE",
    required: true
  },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true }
});

module.exports = mongoose.model("Competition", CompetitionScheme);
