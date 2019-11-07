const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    user_id: { type:Schema.Types.ObjectId, required: true, ref: "User" },
    court_id: { type:Schema.Types.ObjectId, required: true, ref: "Court" },
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true },
  });

  module.exports = mongoose.model("Book", BookSchema);