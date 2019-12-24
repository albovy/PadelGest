const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateCoachingScheme = new Schema({
  title: { type: String, required: true }, 
  date: { type: Date, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("PrivateCoaching", PrivateCoachingScheme);