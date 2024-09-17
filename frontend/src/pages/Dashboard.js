import React, { useState, useEffect } from 'react';
import PlaidLinkButton from '../components/PlaidLinkButton';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch user-specific data from your backend
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5005/api/me', {
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

  if (!user || !user.email) return <p>Loading user data...</p>; // Display loading while fetching

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
      <p>Protected Data: {JSON.stringify(data)}</p> {/* Display user data */}

      {/* Pass user._id to PlaidLinkButton to handle Plaid logic */}
      <div className="mt-8">
        <PlaidLinkButton userId={user._id} /> {/* Plaid logic handled here */}
      </div>
    </div>
  );
};

export default Dashboard;
