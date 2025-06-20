const express = require('express');
const mongoose = require('mongoose');
const DiaryEntry = require('../models/diaryEntry');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// DELETE /api/diaryEntry/:id
router.delete('/:id', async (req, res) => {

  const { id } = req.params;
console.log(id,"id for delete")
  try {

    const deletedDiaryEntry = await DiaryEntry.findByIdAndDelete(id);

    if (!deletedDiaryEntry) {
      return res.status(404).json({ message: 'Diary entry not found' });
    }

    return res.status(200).json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/diaryEntry/:id', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
