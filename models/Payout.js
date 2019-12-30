const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayoutSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  billingAddress: { type: String, required: true },
  creditCard: { type: Number, required: true, default: 0 },
  amount: { type: Number, required: true },
  concept: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Payout", PayoutSchema);
