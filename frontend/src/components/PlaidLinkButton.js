import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLinkButton = ({ userId }) => {
  const [linkToken, setLinkToken] = useState(null);

  // Fetch the link token when the component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await axios.post('/api/plaid/create-link-token', { userId });
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      // When PlaidLink is successful, exchange the public token for an access token
      try {
        const response = await axios.post('/api/plaid/exchange-public-token', { public_token });
        console.log('Access Token:', response.data.accessToken);
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    },
  });

  return (
    <button onClick={open} disabled={!ready}>
      Link Your Bank Account
    </button>
  );
};

export default PlaidLinkButton;
