const express = require('express');
const router = express.Router();

// Route for budgets
router.get('/budget', (req, res) => {
  // Add logic to fetch user budgets here
  res.json({ message: 'Budget data' });
});

module.exports = router;
