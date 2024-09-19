import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const SpendingTrends = () => {
  const [spendingData, setSpendingData] = useState([]); // Initialize as an empty array
  const [message, setMessage] = useState(''); // Add a state to handle any backend messages
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/insights/spending-per-category', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            startDate: '2023-01-01',
            endDate: '2023-12-31',
          }
        });

        // Handle the response appropriately
        if (Array.isArray(response.data)) {
          setSpendingData(response.data); // If it's an array, treat it as valid spending data
        } else if (response.data.message) {
          // If it's an object with a message, handle it as a backend message
          setMessage(response.data.message);
        } else {
          console.error('Unexpected response format:', response.data);
          setMessage('An unexpected error occurred.');
        }

      } catch (error) {
        console.error('Error fetching spending data:', error);
        setMessage('Error fetching spending data.');
      }
    };

    fetchSpendingData();
  }, [token]);

  // Prepare data for Bar chart if spending data is available
  const categories = spendingData.length > 0 ? spendingData.map(item => item._id) : [];
  const amounts = spendingData.length > 0 ? spendingData.map(item => item.totalAmount) : [];

  const data = {
    labels: categories,
    datasets: [{
      label: 'Total Spending',
      data: amounts,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Spending Trends</h2>
      {spendingData.length > 0 ? (
        <Bar data={data} />
      ) : (
        <p className="text-gray-400">
          {message || 'No spending data available'} {/* Display message or fallback */}
        </p>
      )}
    </div>
  );
};

export default SpendingTrends;
