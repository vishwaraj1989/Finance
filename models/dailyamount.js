const mongoose = require("mongoose");

const dailyAmountSchema = new mongoose.Schema({
  diaryNumber: {
    type: Number,
    required: true,
  },
  diarycollection: {
    type: Number,
    required: true,
  },
}, { timestamps: true }); // important for `createdAt`

module.exports = mongoose.model("DailyAmount", dailyAmountSchema);
