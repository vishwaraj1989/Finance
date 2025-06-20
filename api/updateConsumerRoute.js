const express = require('express');
const mongoose = require('mongoose');
const DiaryEntry = require('../models/diaryEntry');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// PUT /api/diaryEntries/:id - Update a DiaryEntry item
router.put('/:_id', async (req, res) => {
  const { _id } = req.params;
  const { diarynumber, name, address, reference, amount, days, hapto } = req.body;

  try {

    // Find and update the DiaryEntry
    const updatedDiaryEntry = await DiaryEntry.findByIdAndUpdate(
      _id,
      { diarynumber, name, address, reference, amount, days, hapto },
      { new: true } // return the updated document
    );

    // If no DiaryEntry is found
    if (!updatedDiaryEntry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    // Return updated DiaryEntry
    return res.status(200).json(updatedDiaryEntry);
  } catch (error) {
    console.error('Error updating Diary entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
