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

// Route to create a link token
router.post('/create-link-token', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'userId is required and must be a non-empty string' });
    }

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

// Route to exchange public token for access token
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

// Route to fetch transactions
// router.get('/transactions', async (req, res) => {
//   try {
//     const { accessToken, startDate, endDate } = req.query;

//     // Ensure accessToken is provided
//     if (!accessToken) {
//       return res.status(400).json({ error: 'Access token is required' });
//     }

//     // Fetch transactions from Plaid
//     const response = await plaidClient.transactionsGet({
//       access_token: accessToken,
//       start_date: startDate,
//       end_date: endDate,
//     });

//     // Send the transactions data back
//     res.json(response.data.transactions);
//   } catch (error) {
//     console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Error fetching transactions' });
//   }
// });


// Route to fetch transactions with pagination
router.get('/transactions', async (req, res) => {
  try {
    const { accessToken, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Ensure accessToken is provided
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Fetch transactions from Plaid
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: parseInt(limit), // How many transactions to return per page
        offset: parseInt(offset), // Which transaction to start from
      },
    });

    // Send the transactions data back with pagination info
    res.json({
      transactions: response.data.transactions,
      total_transactions: response.data.total_transactions,
      current_page: page,
      total_pages: Math.ceil(response.data.total_transactions / limit),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});








module.exports = router;
