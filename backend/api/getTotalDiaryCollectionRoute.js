const express = require("express");
const DailyAmount = require("../models/dailyamount");

const router = express.Router();

router.get("/", async (req, res) => {
  let { diaryNumber } = req.query;

  console.log("Received diaryNumber:", diaryNumber);

  if (!diaryNumber || isNaN(diaryNumber)) {
    return res.status(400).json({ error: "Invalid or missing diaryNumber parameter" });
  }

  diaryNumber = Number(diaryNumber);

  try {
    // Note: You are already connected globally, no need to call connectToDatabase() here

    const result = await DailyAmount.aggregate([
      { $match: { diaryNumber } },
      {
        $group: {
          _id: null,
          total: { $sum: "$diarycollection" },
          lastPaymentDate: { $max: "$createdAt" },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    const lastPaymentDate = result.length > 0 ? result[0].lastPaymentDate : null;

    res.status(200).json({ total, lastPaymentDate });
  } catch (error) {
    console.error("Error fetching total diary collection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
