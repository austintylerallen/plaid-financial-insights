import React, { useState, useEffect } from 'react';
import PlaidLinkButton from '../components/PlaidLinkButton';
import Transactions from '../components/Transactions'; // Import Transactions component
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Log user data for debugging
  console.log('User from Redux:', user); // Check if the user object is coming from Redux

  // Fetch user-specific data from your backend
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5005/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setData(response.data); // Set the data received from backend
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData(); // Call fetchData on component mount
  }, [token]);

  // Check if user is loaded and user.id exists (changed _id to id)
  if (!user || !user.id) {
    console.log('User is not available or user.id is undefined.');
    return <p>Loading user data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>

      {/* Display user-specific protected data */}
      <p>Protected Data: {data ? JSON.stringify(data) : "Loading protected data..."}</p>

      {/* Pass user.id to PlaidLinkButton to handle Plaid logic */}
      <div className="mt-8">
        <PlaidLinkButton userId={user.id} /> {/* Plaid logic handled here */}
      </div>

      {/* Add Transactions component to display user transactions */}
      <div className="mt-8">
        <Transactions userId={user.id} /> {/* Pass the user.id to Transactions */}
      </div>
    </div>
  );
};

export default Dashboard;
