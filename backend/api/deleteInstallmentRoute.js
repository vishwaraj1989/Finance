
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const DailyAmount = require('../models/dailyamount');

const router = express.Router();

// GET /api/delete-installment?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    const dailyAmounts = await DailyAmount.find(filter).sort({ createdAt: -1 });
    res.status(200).json(dailyAmounts);
  } catch (error) {
    console.error('Error fetching daily amounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/delete-installment/:entryId
router.delete('/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    console.log("Deleting entry with id (backend):", entryId);

    if (!entryId) {
      return res.status(400).json({ message: 'Missing entryId parameter' });
    }

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({ message: 'Invalid entryId' });
    }

    const deleted = await DailyAmount.findByIdAndDelete(entryId);

    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
