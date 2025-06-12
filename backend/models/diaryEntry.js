const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  diaryNumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobileNumber: { type: String, required: false },
  reference: { type: String, required: false },
  amount: { type: Number, required: true },
  days: { type: Number, required: true },
  installment: { type: Number, required: true },
  percentage: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

module.exports = DiaryEntry;
