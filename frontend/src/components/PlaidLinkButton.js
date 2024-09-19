import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLinkButton = ({ userId, onVerificationComplete }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const token = localStorage.getItem('token');

      if (!userId || userId.trim() === '') {
        console.error('Invalid userId:', userId);
        setError('Invalid userId. Cannot create link token.');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:5005/api/plaid/create-link-token',
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        setError('Failed to create link token');
      }
    };

    createLinkToken();
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5005/api/plaid/exchange-token',
          { publicToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Store the access token
        const accessToken = response.data.accessToken;
        console.log('Received Access Token:', accessToken); // Log the received access token
        if (!accessToken.startsWith('access-')) {
          throw new Error('Received invalid access token format');
        }

        localStorage.setItem('plaid_access_token', accessToken);

        // Call the parent callback to trigger data refresh
        if (onVerificationComplete) {
          onVerificationComplete(accessToken); // Pass the access token
        }
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setError('Failed to exchange token');
      }
    },
  });

  if (error) return <p>{error}</p>;

  return linkToken ? (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Link Your Bank Account
    </button>
  ) : (
    <p>Loading Link Token...</p>
  );
};

export default PlaidLinkButton;
