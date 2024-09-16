require('dotenv').config();  // Load environment variables
const plaid = require('plaid');

const plaidClient = new plaid.PlaidApi(
  new plaid.Configuration({
    basePath: plaid.PlaidEnvironments[process.env.PLAID_ENV],  // Use PlaidEnvironments
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

module.exports = plaidClient;
