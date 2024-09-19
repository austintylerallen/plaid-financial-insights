const express = require('express');
const router = express.Router();

// Route for spending per category
router.get('/spending-per-category', (req, res) => {
  const { startDate, endDate } = req.query;
  // Add logic to calculate spending per category here
  res.json({ message: `Spending data between ${startDate} and ${endDate}` });
});

module.exports = router;
