const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClasificationSchema = new Schema({
    competition_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Competition"
    },  
    user1_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    user2_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    points: { type: Number, required: true },
});

module.exports = mongoose.model("Clasification", ClasificationSchema);