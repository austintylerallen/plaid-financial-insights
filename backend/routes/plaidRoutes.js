const express = require('express');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Plaid client setup
const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

router.post('/create-link-token', async (req, res) => {
    try {
      const { userId } = req.body;
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'Plaid Financial Insights',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
      });
      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.error('Error creating link token:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error creating link token' });
    }
  });
  
  router.post('/exchange-token', async (req, res) => {
    try {
      const { publicToken } = req.body;
      const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      res.json({ accessToken: response.data.access_token });
    } catch (error) {
      console.error('Error exchanging public token:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error exchanging public token' });
    }
  });
  

module.exports = router;
