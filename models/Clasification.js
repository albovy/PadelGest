const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClasificationSchema = new Schema({
    competition_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Competition"
    },  
    group_id :{type:Schema.Types.ObjectId, required: true, ref : "Group"}
});

module.exports = mongoose.model("Clasification", ClasificationSchema);