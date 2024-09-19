

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import SpendingChart from './SpendingChart'; // Import the chart component

// const Transactions = ({ userId }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [startDate, setStartDate] = useState('2010-01-01');
//   const [endDate, setEndDate] = useState('2025-01-01');
//   const [currentPage, setCurrentPage] = useState(1); // Add page tracking
//   const [totalPages, setTotalPages] = useState(1); // Track total pages
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem('token');
//   const accessToken = localStorage.getItem('plaid_access_token');

//   const fetchTransactions = async (page = 1) => {
//     if (!userId) {
//       console.error('User ID is undefined, cannot proceed with fetching transactions.');
//       return;
//     }

//     if (!accessToken) {
//       console.error('Access token not found, please link your bank account.');
//       return;
//     }

//     try {
//       setLoading(true); // Set loading state
//       const transactionsResponse = await axios.get('http://localhost:5005/api/plaid/transactions', {
//         params: {
//           accessToken,
//           startDate,
//           endDate,
//           page,
//           limit: 10, // You can adjust this limit for the number of transactions per page
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('Transactions response:', transactionsResponse.data);

//       if (transactionsResponse.data.transactions) {
//         setTransactions((prevTransactions) => [
//           ...prevTransactions,
//           ...transactionsResponse.data.transactions,
//         ]); // Append new transactions to the existing list
//         setTotalPages(transactionsResponse.data.total_pages); // Update total pages
//       }
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//     } finally {
//       setLoading(false); // Turn off loading state
//     }
//   };

//   useEffect(() => {
//     // Reset transactions and load the first page when component mounts
//     setTransactions([]);
//     fetchTransactions(1); // Load the first page of transactions
//   }, [startDate, endDate, accessToken, token]);

//   // Handle infinite scroll to load more transactions
//   const handleScroll = useCallback(() => {
//     if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   }, [currentPage, totalPages, loading]);

//   useEffect(() => {
//     if (currentPage > 1) {
//       fetchTransactions(currentPage); // Fetch the next page of transactions
//     }
//   }, [currentPage]);

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);

//   // Apply filters when startDate, endDate, or categoryFilter changes
//   useEffect(() => {
//     const filtered = transactions.filter(
//       (transaction) =>
//         (categoryFilter === '' || transaction.category?.includes(categoryFilter)) &&
//         (!startDate || new Date(transaction.date) >= new Date(startDate)) &&
//         (!endDate || new Date(transaction.date) <= new Date(endDate))
//     );
//     setFilteredTransactions(filtered);
//   }, [categoryFilter, startDate, endDate, transactions]);

//   return (
//     <div className="min-h-screen bg-gray-900 p-8">
//       <h2 className="text-3xl font-bold text-gray-100 mb-6">Your Transactions</h2>

//       {/* Flexbox container to align transactions list on the left and graph on the right */}
//       <div className="flex space-x-8">

//         {/* Left Side: Transactions List */}
//         <div className="w-full lg:w-3/5 space-y-6">
//           {/* Combined Filter Bar */}
//           <div className="flex flex-wrap items-center gap-4">
//             {/* Start Date Filter */}
//             <div className="flex items-center space-x-2">
//               <label className="block text-sm font-medium text-gray-400">Start:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* End Date Filter */}
//             <div className="flex items-center space-x-2">
//               <label className="block text-sm font-medium text-gray-400">End:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Category Filter */}
//             <div className="flex items-center space-x-2">
//               <label className="block text-sm font-medium text-gray-400">Category:</label>
//               <select
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 value={categoryFilter}
//                 className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
//               >
//                 <option value="">All</option>
//                 <option value="Food">Food</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Groceries">Groceries</option>
//               </select>
//             </div>
//           </div>

//           {/* Transaction List */}
//           <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
//             <ul className="divide-y divide-gray-600">
//               {filteredTransactions.length > 0 ? (
//                 filteredTransactions.map((transaction, index) => (
//                   <li key={`${transaction.transaction_id}-${index}`} className="py-4">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-sm font-medium text-gray-100">{transaction.name}</p>
//                         <p className="text-sm text-gray-400">
//                           {transaction.date} -{' '}
//                           {transaction.category ? transaction.category.join(', ') : 'Uncategorized'}
//                         </p>
//                       </div>
//                       <div className="text-sm font-medium text-gray-100">
//                         ${transaction.amount.toFixed(2)}
//                       </div>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-400">No transactions found. Please link your bank account or try again later.</p>
//               )}
//             </ul>
//           </div>
//         </div>

//         {/* Right Side: Spending Graph */}
//         <div className="w-full lg:w-2/5 bg-gray-800 p-6 rounded-lg shadow-lg sticky top-16 h-full">
//           {/* Sticky container added to make the graph scroll */}
//           <SpendingChart transactions={filteredTransactions} />
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Transactions;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SpendingChart from './SpendingChart'; // Import the chart component

const Transactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('2010-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');
  const [currentPage, setCurrentPage] = useState(1); // Add page tracking
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const accessToken = localStorage.getItem('plaid_access_token');

  const fetchTransactions = async (page = 1) => {
    if (!userId) {
      console.error('User ID is undefined, cannot proceed with fetching transactions.');
      return;
    }

    if (!accessToken) {
      console.error('Access token not found, please link your bank account.');
      return;
    }

    try {
      setLoading(true); // Set loading state
      const transactionsResponse = await axios.get('http://localhost:5005/api/plaid/transactions', {
        params: {
          accessToken,
          startDate,
          endDate,
          page,
          limit: 10, // You can adjust this limit for the number of transactions per page
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Transactions response:', transactionsResponse.data);

      if (transactionsResponse.data.transactions) {
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          ...transactionsResponse.data.transactions,
        ]); // Append new transactions to the existing list
        setTotalPages(transactionsResponse.data.total_pages); // Update total pages
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  useEffect(() => {
    // Reset transactions and load the first page when component mounts
    setTransactions([]);
    fetchTransactions(1); // Load the first page of transactions
  }, [startDate, endDate, accessToken, token]);

  // Handle infinite scroll to load more transactions
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages, loading]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchTransactions(currentPage); // Fetch the next page of transactions
    }
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Apply filters when startDate, endDate, or categoryFilter changes
  useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        (categoryFilter === '' || transaction.category?.includes(categoryFilter)) &&
        (!startDate || new Date(transaction.date) >= new Date(startDate)) &&
        (!endDate || new Date(transaction.date) <= new Date(endDate))
    );
    setFilteredTransactions(filtered);
  }, [categoryFilter, startDate, endDate, transactions]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">Your Transactions</h2>

      {/* Flexbox container to align transactions list on the left and graph on the right */}
      <div className="flex space-x-8">

        {/* Left Side: Transactions List */}
        <div className="w-full lg:w-3/5 space-y-6">
          {/* Combined Filter Bar */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Start Date Filter */}
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-400">Start:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
              />
            </div>

            {/* End Date Filter */}
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-400">End:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-400">Category:</label>
              <select
                onChange={(e) => setCategoryFilter(e.target.value)}
                value={categoryFilter}
                className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
              >
                <option value="">All</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <ul className="divide-y divide-gray-600">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <li key={`${transaction.transaction_id}-${index}`} className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-100">{transaction.name}</p>
                        <p className="text-sm text-gray-400">
                          {transaction.date} -{' '}
                          {transaction.category ? transaction.category.join(', ') : 'Uncategorized'}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-100">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No transactions found. Please link your bank account or try again later.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Right Side: Spending Graph */}
        <div className="w-full lg:w-2/5 bg-gray-800 p-6 rounded-lg shadow-lg sticky top-16 h-full">
          {/* Sticky container added to make the graph scroll */}
          <SpendingChart transactions={filteredTransactions} />
        </div>
      </div>
    </div>

  );
};

export default Transactions;
