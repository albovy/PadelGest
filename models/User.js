const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: { type: String, required: true, unique: true },
  passwd: { type: String, required: true },
  name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  dni: { type: String, required: true, max: 9, unique: true },
  gender: {
    type: String,
    enum: ["MAN", "WOMAN"],
    default: "MAN",
    required: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "ATHLETE", "COACH"],
    default: "ATHLETE",
    required: true
  },
  member: {type: Boolean, required: true, default: false },
  memberDate: {type: Date, required: false, default: null}
});

module.exports = mongoose.model("User", UserSchema);
