const express = require('express');
const DiaryEntry = require('../models/diaryEntry');
const router = express.Router();

// GET /api/consumer-list/
router.get('/', async (req, res) => {
  try {
    const diaryEntries = await DiaryEntry.find();
    res.status(200).json(diaryEntries);
  } catch (err) {
    console.error('Error fetching DiaryEntry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
