const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourtScheme = new Schema({
  name: { type: String, required: true },
  surface: { 
    type: String,
    enum: ["GRASS", "SYNTHETICS", "CONCRETE", "CEMENT"],
    default: "CEMENT",
    required: true },
  type: { 
    type: String,
    enum: ["OUTSIDE", "INSIDE"],
    default: "INSIDE",
    required: true
   }
});

module.exports = mongoose.model("Court", CourtScheme);