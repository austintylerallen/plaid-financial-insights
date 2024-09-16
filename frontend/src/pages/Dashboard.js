import React from 'react';
import PlaidLinkButton from '../components/PlaidLinkButton';
import Transactions from '../components/Transactions';

const Dashboard = () => {
  const userId = 'your-unique-user-id';  // Replace with an actual unique user ID

  return (
    <div>
      <h1>Financial Dashboard</h1>
      <PlaidLinkButton userId={userId} />
      <Transactions userId={userId} />
    </div>
  );
};

export default Dashboard;
