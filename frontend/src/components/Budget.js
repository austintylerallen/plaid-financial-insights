import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budget = () => {
  const [budgets, setBudgets] = useState({});
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const token = localStorage.getItem('token');

  // Fetch existing budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/budget', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check if response is valid JSON and contains the expected structure
        if (response.data && typeof response.data === 'object') {
          setBudgets(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setBudgets({}); // Set to an empty object if response is not valid
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, [token]);

  // Set budget for a category
  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount) {
      console.error('Category and amount are required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5005/api/budget/set-budget',
        { category, amount },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBudgets((prevBudgets) => ({
          ...prevBudgets,
          [category]: amount,
        }));
        setCategory('');
        setAmount('');
      } else {
        console.error('Error setting budget:', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Set Budget</h2>
      <form onSubmit={handleSetBudget}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2 mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2 mt-1 block w-full"
            required
          />
        </div>
        <button className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-all">
          Set Budget
        </button>
      </form>
      {Object.keys(budgets).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Current Budgets</h3>
          <ul className="list-disc list-inside">
            {Object.keys(budgets).map((category) => (
              <li key={category} className="text-gray-400">
                {category}: ${budgets[category]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Budget;
