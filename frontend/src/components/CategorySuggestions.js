import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategorySuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/suggestions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [token]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Category Suggestions</h2>
      {suggestions.length > 0 ? (
        <ul className="list-disc list-inside">
          {suggestions.map((suggestion) => (
            <li key={suggestion._id} className="text-gray-400">
              {suggestion.name}: Suggested Category - {suggestion.suggestedCategory}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No uncategorized transactions found.</p>
      )}
    </div>
  );
};

export default CategorySuggestions;
