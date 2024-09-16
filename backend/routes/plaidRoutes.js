const express = require('express');
const plaidClient = require('../config/plaidConfig');
const User = require('../models/User');

const router = express.Router();

// Exchange public token for access token and store in MongoDB
router.post('/exchange-public-token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.access_token;
    const itemId = response.item_id;

    // Store the access token and itemId in MongoDB
    const user = new User({
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
    });
    await user.save();

    res.json({ accessToken, itemId });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Could not exchange public token' });
  }
});


router.post('/create-link-token', async (req, res) => {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: req.body.userId },  // Unique ID for your user
        client_name: 'Plaid Financial Insights',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        redirect_uri: process.env.PLAID_REDIRECT_URI,  // Required for OAuth
      });
      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.error('Error generating link token:', error);
      res.status(500).json({ error: 'Could not generate link token' });
    }
  });

  
  
module.exports = router;
