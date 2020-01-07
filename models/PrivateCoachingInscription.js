const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateCoachingInscriptionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  privateCoaching_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "PrivateCoaching"
  }
});

module.exports = mongoose.model("PrivateCoachingInscription", PrivateCoachingInscriptionSchema);
