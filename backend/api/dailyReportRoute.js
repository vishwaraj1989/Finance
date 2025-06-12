const express = require('express');
const mongoose = require('mongoose');
const DiaryEntry = require('../models/diaryEntry');
const DailyAmount = require('../models/dailyamount');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const reportHandler = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end(); // Method Not Allowed
    }

    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Set start and end of day correctly without mutating date object
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // Query DailyAmount documents created within the day
    const report = await DailyAmount.find({
      createdAt: { $gte: start, $lt: end },
    });

    // Get unique diaryNumbers from report
    const uniqueDiaryNumbers = [...new Set(report.map(item => item.diaryNumber))];

    // Fetch all DiaryEntry documents for these diaryNumbers in one query
    const diaryEntries = await DiaryEntry.find({
      diaryNumber: { $in: uniqueDiaryNumbers }
    });

    // Map diaryNumber to name for quick lookup
    const diaryEntryMap = diaryEntries.reduce((acc, entry) => {
      acc[entry.diaryNumber] = entry.name;
      return acc;
    }, {});

    // Combine report data with corresponding names
    const reportWithData = report.map(item => ({
      ...item._doc,
      name: diaryEntryMap[item.diaryNumber] || 'Diary entry not found',
    }));

    res.json(reportWithData);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'An error occurred while fetching the report.' });
  }
};

module.exports = reportHandler;
