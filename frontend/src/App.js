import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import OAuthReturn from './pages/OAuthReturn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oauth-return" element={<OAuthReturn />} />
      </Routes>
    </Router>
  );
}

export default App;
