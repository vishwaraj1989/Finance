const express = require("express");
const router = express.Router();
const DiaryEntry = require("../models/diaryEntry");

// POST /api/newConsPost
router.post("/", async (req, res) => {
  console.log('Received data:', req.body); // Log the request body

  const { diaryNumber, name, address, mobileNumber, reference, amount, days, installment, percentage } = req.body;

  // Log the diarynumber to ensure it's correct
  console.log('Diary Number:', diaryNumber);

  // Check if diarynumber is provided and valid
  if (diaryNumber == null || diaryNumber === "") {
    return res.status(400).json({ error: "Diary number is required and cannot be null or empty." });
  }

  // Validate other required fields
  if (!name || !address || !amount || !days || !installment) {
    return res.status(400).json({ error: 'All fields except mobileNumber and reference are required.' });
  }

  try {
    // Check if diarynumber already exists
    const existing = await DiaryEntry.findOne({ diaryNumber });
    if (existing) {
      return res.status(400).json({ error: "Diary number already exists" });
    }

    // Create a new entry
    const newEntry = new DiaryEntry(req.body);
    
    // Save the entry
    await newEntry.save();
    res.status(201).json({ message: "Entry saved successfully" });

  } catch (err) {
    console.error("Error saving entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// GET /api/consListGet
router.get("/consListGet", async (req, res) => {
  try {
    const entries = await DiaryEntry.find().sort({ diaryNumber: 1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;


