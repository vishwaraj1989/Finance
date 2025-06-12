const express = require('express');
const DiaryEntry = require('../models/diaryEntry'); // Mongoose model

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    console.log('Received name query:', name);

    if (!name) {
      return res.status(400).json({ error: "name query parameter is required" });
    }

    // Case-insensitive search
    const entry = await DiaryEntry.findOne({ name: new RegExp(`^${name}$`, 'i') });
    console.log('MongoDB result:', entry);

    if (!entry) {
      return res.status(404).json({ message: 'Consumer not found' });
    }

    return res.status(200).json({ diaryNumber: entry.diaryNumber });
  } catch (error) {
    console.error('Error fetching diary number by name:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
