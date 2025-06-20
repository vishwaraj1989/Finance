const express = require("express");
const mongoose = require("mongoose");
const DailyAmount = require("../models/dailyamount");
require('dotenv').config();

const router = express.Router();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

router.post('/', async (req, res) => {
  try {
    await connectToDatabase();

    const { diaryNumber, diarycollection } = req.body;

    if (!diaryNumber || !diarycollection) {
      return res.status(400).json({ error: 'diaryNumber and diarycollection are required' });
    }

    const newDailyAmount = new DailyAmount({ diaryNumber, diarycollection });
    const savedDailyAmount = await newDailyAmount.save();

    res.status(200).json(savedDailyAmount);
  } catch (error) {
    console.error('Error saving daily amount:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
