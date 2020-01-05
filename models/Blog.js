const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogScheme = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: String, required: true }
});

module.exports = mongoose.model("Blog", BlogScheme);