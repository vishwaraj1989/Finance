
const express = require('express');
const DiaryEntry = require('../models/diaryEntry'); // Adjust this path as per your project structure

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { diaryNumber } = req.query;
    console.log("Received diaryNumber:", diaryNumber);

    if (!diaryNumber) {
      return res.status(400).json({ error: 'Diary number is required' });
    }

    const parsedDiaryNumber = Number(diaryNumber);
    if (isNaN(parsedDiaryNumber) || parsedDiaryNumber <= 0) {
      return res.status(400).json({ error: 'Invalid diary number' });
    }

    const consumer = await DiaryEntry.findOne({ diaryNumber: parsedDiaryNumber });
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    // Pick only needed fields
    const { name, amount, installment, days, createdAt } = consumer;
    res.status(200).json({ name, amount, installment, days, createdAt });
  } catch (error) {
    console.error('Error fetching consumer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
