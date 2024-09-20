import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Plaid Financial Insights</h1>
      <p className="mb-6 text-lg">Track your financial transactions and insights with ease.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
