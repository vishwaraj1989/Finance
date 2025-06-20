const DailyAmount = require('../models/dailyamount');

// Handler for the payments API endpoint
const paymentsHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const paymentsData = await DailyAmount.find(); // Fetch payments data using the DailyAmount model
    res.status(200).json(paymentsData);
  } catch (error) {
    console.error('Error fetching payments data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = paymentsHandler;
