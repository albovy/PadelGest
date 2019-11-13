const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClasificationSchema = new Schema({
  competition_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Competition"
  },
  user1_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  user2_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  category: { type: String, required: true },
  subGroup: { type: Number, required: true },
  points: { type: Number, required: true }
});

module.exports = mongoose.model("Clasification", ClasificationSchema);
