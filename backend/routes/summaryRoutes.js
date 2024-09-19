const express = require('express');
const router = express.Router();

// Route for monthly summary
router.get('/monthly-summary', (req, res) => {
  const { year, month } = req.query;
  // Add logic to generate monthly summary here
  res.json({ message: `Monthly summary for ${year}-${month}` });
});

module.exports = router;
