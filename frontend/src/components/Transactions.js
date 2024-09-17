import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  // Define startDate and endDate
  const startDate = '2023-01-01';
  const endDate = '2024-01-01';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/plaid/transactions', {
          params: {
            userId,
            startDate,  // Use defined variables
            endDate     // Use defined variables
          }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div>
      <h2>Your Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.transaction_id}>
            {transaction.date} - {transaction.name} - ${transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
