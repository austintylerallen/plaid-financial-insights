require('dotenv').config(); // Load environment variables
const plaid = require('plaid');

// Validate environment variables
const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } = process.env;

if (!PLAID_CLIENT_ID || !PLAID_SECRET || !PLAID_ENV) {
  throw new Error(
    'Missing one or more required environment variables: PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV'
  );
}

// Determine the Plaid environment
const basePath =
  plaid.PlaidEnvironments[PLAID_ENV] || plaid.PlaidEnvironments.sandbox; // Default to sandbox if PLAID_ENV is missing or invalid

// Plaid client configuration
const plaidClient = new plaid.PlaidApi(
  new plaid.Configuration({
    basePath: basePath,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
    },
  })
);

module.exports = plaidClient;
