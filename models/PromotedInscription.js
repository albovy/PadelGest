const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromotedInscriptionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    promoted_id: { type: Schema.Types.ObjectId, required: true, ref: "PromotedGame"}
});

module.exports = mongoose.model("PromotedInscription", PromotedInscriptionSchema);