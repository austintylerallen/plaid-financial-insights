import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [topPurchases, setTopPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page for top purchases
  const [totalPages, setTotalPages] = useState(1); // Track the total pages for top purchases
  const [loading, setLoading] = useState(false); // Track loading state
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const token = localStorage.getItem('token');

  // Fetch the monthly summary including top purchases
  const fetchMonthlySummary = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5005/api/summary/monthly-summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          year,
          month,
          page, // Add pagination for top purchases
          limit: 10, // Number of top purchases per page
        }
      });

      // Set summary data
      if (page === 1) {
        setSummary(response.data);
        setTopPurchases(response.data.topPurchases || []);
        setTotalPages(response.data.total_pages || 1); // Set the total pages for top purchases
      } else {
        // Append new top purchases for subsequent pages
        setTopPurchases((prevPurchases) => [
          ...prevPurchases,
          ...(response.data.topPurchases || [])
        ]);
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data on component mount and when year or month changes
  useEffect(() => {
    setCurrentPage(1);
    setTopPurchases([]);
    fetchMonthlySummary(1); // Fetch first page
  }, [year, month, token]);

  // Handle scroll event for infinite loading of top purchases
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages, loading]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMonthlySummary(currentPage); // Fetch the next page of top purchases
    }
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Safeguard to ensure data exists before rendering
  const totalSpending = summary?.totalSpending?.toFixed(2) || '0.00';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Monthly Summary</h2>
      
      {/* Year and Month Selectors */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
          >
            {/* Dynamically render options for past years */}
            {[...Array(5)].map((_, index) => {
              const y = new Date().getFullYear() - index;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md p-2"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((m, index) => (
              <option key={index + 1} value={index + 1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {summary ? (
        <div>
          <p className="text-gray-400">Total Spending: ${totalSpending}</p>
          {topPurchases.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-300 mt-4">Top Purchases:</h3>
              <ul className="list-disc list-inside">
                {topPurchases.map((purchase, index) => (
                  <li key={`${purchase._id}-${index}`} className="text-gray-400">
                    {purchase.name}: ${purchase.amount.toFixed(2)}
                  </li>
                ))}
              </ul>
              {loading && <p className="text-gray-400">Loading more...</p>}
            </>
          ) : (
            <p className="text-gray-400 mt-4">No top purchases available.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-400">No data available for this month.</p>
      )}
    </div>
  );
};

export default MonthlySummary;
