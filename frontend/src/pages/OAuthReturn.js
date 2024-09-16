import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract public token from the URL
    const publicToken = new URLSearchParams(location.search).get('oauth_state_id');

    if (publicToken) {
      // Exchange public token for access token
      axios.post('/api/plaid/exchange-public-token', { public_token: publicToken })
        .then(response => {
          console.log('Access Token:', response.data.accessToken);
          // Redirect the user to the dashboard or desired page
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error exchanging public token:', error);
        });
    } else {
      console.error('No public token found in OAuth return URL');
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>OAuth Return</h1>
      <p>Completing OAuth flow...</p>
    </div>
  );
};

export default OAuthReturn;
