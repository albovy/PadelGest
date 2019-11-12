const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClashSchema = new Schema({
    competition_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Competition"
      },
    user1_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    user2_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    user3_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    user4_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" },
    tryDate:  { type: Date, required: true,default: new Date(0,0,0,0,0,0,0)}
  });
  
  module.exports = mongoose.model("Clash", ClashSchema);