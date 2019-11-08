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
    user4_id: { type: Schema.Types.ObjectId, required: true, ref: "Group" }
  });
  
  module.exports = mongoose.model("Clash", ClashSchema);