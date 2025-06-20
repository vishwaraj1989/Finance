
const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/diaryEntry'); // Your Mongoose model

// GET /api/getConsumerName?diaryNumber=123
router.get('/', async (req, res) => {
  try {
    const { diaryNumber } = req.query;

    if (!diaryNumber) {
      return res.status(400).json({ error: 'Diary number is required' });
    }

    // Find consumer by diaryNumber (string or number)
    const consumer = await DiaryEntry.findOne({ diaryNumber });

    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    const { name, amount, installment, days, createdAt } = consumer;

    res.status(200).json({ name, amount, installment, days, createdAt });
  } catch (error) {
    console.error('Error fetching consumer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



