import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get the user from Redux state

  const handleLogout = () => {
    window.localStorage.clear(); // Clear all localStorage data
    dispatch(logout()); // Dispatch logout action to clear Redux state
    navigate('/'); // Navigate to the landing page
  };

  // Only render the Navbar if the user is logged in
  if (!user) {
    return null; // Return null if user is not logged in
  }

  return (
    <nav className="p-4 bg-gray-700 text-gray-100 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">App Name</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
