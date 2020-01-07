const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateCoachingScheme = new Schema({
  title: { type: String, required: true }, 
  date: { type: Date, required: true },
  description: { type: String, required: true },
  coach: {  type: Schema.Types.ObjectId, required: true, ref: "User"  },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("PrivateCoaching", PrivateCoachingScheme);