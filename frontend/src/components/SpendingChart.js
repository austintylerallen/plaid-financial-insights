import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const SpendingChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Process transaction data to calculate total spending by category
      const categorySpending = transactions.reduce((acc, transaction) => {
        const category = transaction.category ? transaction.category[0] : 'Other'; // Get the first category or use 'Other'
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {});

      // Create data for the chart
      const data = {
        labels: Object.keys(categorySpending), // Categories as labels
        datasets: [
          {
            label: 'Spending by Category ($)',
            data: Object.values(categorySpending), // Amounts as data
            backgroundColor: [
              '#6B7280',  // Soft gray
              '#10B981',  // Soft teal
              '#3B82F6',  // Soft blue
              '#F59E0B',  // Muted yellow
              '#EF4444',  // Muted red
              '#8B5CF6',  // Muted purple
              '#D1D5DB',  // Light gray
            ], // Colors for pie chart slices
            borderWidth: 1,
            borderColor: '#1F2937',  // Darker gray border for better contrast
          },
        ],
      };

      setChartData(data);
    }
  }, [transactions]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">Spending by Category</h2>
      {chartData.labels ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#D1D5DB', // Light gray for better readability
                },
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `$${tooltipItem.raw.toFixed(2)}`; // Display as currency
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-400">No transaction data available to display.</p>
      )}
    </div>
  );
};

export default SpendingChart;
