import React, { useState, useEffect } from 'react';
import PlaidLinkButton from '../components/PlaidLinkButton';
import Transactions from '../components/Transactions';
import SpendingTrends from '../components/SpendingTrends';
import Budget from '../components/Budget';
import MonthlySummary from '../components/MonthlySummary';
import CategorySuggestions from '../components/CategorySuggestions';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionsFetched, setTransactionsFetched] = useState(false); // Track if transactions were fetched
  const [accessToken, setAccessToken] = useState(localStorage.getItem('plaid_access_token') || null);
  const token = localStorage.getItem('token');

  // Function to get a greeting based on the time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // This function will be triggered after Plaid verification completes successfully
  const handleVerificationComplete = (newAccessToken) => {
    console.log("Verification complete, updating access token and fetching transactions...");
    localStorage.setItem('plaid_access_token', newAccessToken); // Store access token in local storage
    setAccessToken(newAccessToken); // Update state with new access token
    setTransactionsFetched(false); // Allow transactions to be fetched again
  };

  // Fetch user-specific data from your backend (including transactions)
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5005/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('API Response:', response.data);
          setData(response.data); // Set the data received from backend
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false after the request finishes
        }
      } else {
        console.error('No token found');
        setLoading(false); // Set loading to false if no token is found
      }
    };
    fetchData();
  }, [token]);

  // Effect to fetch transactions after access token is set
  useEffect(() => {
    if (accessToken && !transactionsFetched) {
      console.log('Access token set, fetching transactions...');
      setTransactionsFetched(true); // Prevent re-fetching unless the access token changes
    }
  }, [accessToken, transactionsFetched]);

  // If still loading, show a loading indicator
  if (loading) {
    return <p className="text-gray-400">Loading user data...</p>;
  }

  // Check if user is loaded and the necessary fields exist
  if (!user || !user.id || !user.firstName || !user.lastName) {
    console.log('User data is missing or incomplete:', user);
    return <p className="text-gray-400">Unable to load user data. Please try again.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center"> {/* Main flex container */}
      {/* Greeting */}
      <h2 className="text-3xl font-bold text-gray-100 mb-6">
        {getGreeting()}, {user.firstName} {user.lastName}
      </h2>

      {/* Display Plaid Link Button if accessToken not available */}
      {!accessToken && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]"> {/* Center the PlaidLinkButton */}
          <p className="text-gray-400 mb-4">Please link your bank account to view transactions.</p>
          <PlaidLinkButton userId={user.id} onVerificationComplete={handleVerificationComplete} />
        </div>
      )}

      {accessToken && (
        <div className="w-full"> {/* Add a wrapper div for content */}
          {/* Add Transactions component to display user transactions */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <Transactions userId={user.id} accessToken={accessToken} />
          </div>

          {/* Spending Trends */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <SpendingTrends />
          </div>

          {/* Budget Management */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <Budget />
          </div>

          {/* Monthly Summaries */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <MonthlySummary />
          </div>

          {/* Category Suggestions */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <CategorySuggestions />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
