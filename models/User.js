const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: { type: String, required: true, unique: true },
  passwd: { type: String, required: true },
  name: { type: String, required: true, max: 100 },
  dni: { type: String, required: true, max: 9, unique: true },
  gender: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "ATHLETE"],
    default: "ATHLETE",
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
