import React from 'react';
import ManagerSidebar from '../sidebar/ManagerSidebar';

const ManagerDashboard = () => {
  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold">ManagerDashboard</h1>
      </div>
    </div>
  );
};

export default ManagerDashboard;
