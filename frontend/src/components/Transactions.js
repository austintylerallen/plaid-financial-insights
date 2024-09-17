import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const token = localStorage.getItem('token');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('plaid_access_token'));

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        console.error('User ID is undefined, cannot proceed with fetching transactions.');
        return;
      }

      if (!accessToken) {
        console.error('Access token not found, please link your bank account.');
        return;
      }

      try {
        // Fetch transactions using the access token
        const transactionsResponse = await axios.get('http://localhost:5005/api/plaid/transactions', {
          params: {
            accessToken,
            startDate,
            endDate
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        console.log('Transactions response:', transactionsResponse.data); // Log the response

        // Log transaction data to ensure it's correct
        if (transactionsResponse.data && transactionsResponse.data.length > 0) {
          console.log('Transactions:', transactionsResponse.data);
          setTransactions(transactionsResponse.data);
          setFilteredTransactions(transactionsResponse.data);
        } else {
          console.log('No transactions found');
        }

      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [userId, startDate, endDate, token, accessToken]);

  // Filter and sort logic
  const filterByCategory = () => {
    const filtered = transactions.filter(transaction => 
      categoryFilter === '' || transaction.category?.includes(categoryFilter)
    );
    setFilteredTransactions(filtered);
  };

  const sortByAmount = (order) => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      if (order === 'asc') {
        return a.amount - b.amount;
      } else if (order === 'desc') {
        return b.amount - a.amount;
      }
      return 0;
    });
    setFilteredTransactions(sorted);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Your Transactions</h2>

      {/* Check if there are transactions */}
      {filteredTransactions.length > 0 ? (
        <>
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="border border-gray-300 rounded-md p-2 mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date:</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="border border-gray-300 rounded-md p-2 mt-1 block w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Category:</label>
            <select 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              value={categoryFilter}
              className="border border-gray-300 rounded-md p-2 mt-1 block w-full"
            >
              <option value="">All</option>
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Groceries">Groceries</option>
            </select>
            <button 
              onClick={filterByCategory} 
              className="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-600"
            >
              Apply Category Filter
            </button>
          </div>

          <div className="mb-4 flex space-x-4">
            <label className="block text-sm font-medium text-gray-700">Sort by Amount:</label>
            <button 
              onClick={() => sortByAmount('asc')} 
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Ascending
            </button>
            <button 
              onClick={() => sortByAmount('desc')} 
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Descending
            </button>
          </div>

          {/* Transaction List */}
          <ul className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <li key={transaction.transaction_id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                    <p className="text-sm text-gray-500"> {transaction.date} - {transaction.category ? transaction.category.join(', ') : 'Uncategorized'} </p> </div> <div className="text-sm font-medium text-gray-900"> ${transaction.amount.toFixed(2)} </div> </div> </li> ))} </ul> </> ) : ( <p>No transactions found. Please link your bank account or try again later.</p> )} </div> ); };

export default Transactions;
