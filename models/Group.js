const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    tournament_id: {type: Schema.Types.ObjectId, required: true, ref:"Tournament"},
    user1_id:{ type: Schema.Types.ObjectId, required : true, ref:"User"},
    user2_id:{type: Schema.Types.ObjectId, required: true, ref:"User"},
    group: {type: String, required: true},
    subGroup : {type : Number, required: true},
    clasificated: {type: Boolean,required:true, default:false}
});

module.exports = mongoose.model("Group", GroupSchema);