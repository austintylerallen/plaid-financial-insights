import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLinkButton = ({ userId }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null); // Error state for handling issues

  useEffect(() => {
    const createLinkToken = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = localStorage.getItem('userId'); // Ensure userId is stored and retrieved properly
        try {
          // Make the POST request to your backend to create a link token
          const response = await axios.post(
            'http://localhost:5005/api/plaid/create-link-token',
            {
              userId, // Passing userId in the body, no need to wrap in another 'user' object
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`, // Passing the JWT token for authentication
                'Content-Type': 'application/json',
              },
            }
          );
      
          // Set the returned link token in state
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
        const token = localStorage.getItem('token'); // Ensure token is used here too
        const response = await axios.post('http://localhost:5005/api/plaid/exchange-token', 
        { publicToken }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass token when exchanging public token
            'Content-Type': 'application/json'
          }
        });
        console.log("Access Token:", response.data.accessToken);
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setError('Failed to exchange token');
      }
    },
  });

  if (error) return <p>{error}</p>; // Show error message if there's an issue

  return (
    linkToken ? (
      <button
        onClick={() => open()}
        disabled={!ready}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Link Your Bank Account
      </button>
    ) : (
      <p>Loading Link Token...</p> // Show loading state
    )
  );
};

export default PlaidLinkButton;
