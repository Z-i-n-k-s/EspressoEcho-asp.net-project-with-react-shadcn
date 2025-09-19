// SidebarLayout.js
import React from "react";
import ROLE from "@/lib/roles";
import Sidebar from "../../pages/shared-components/sidebar/Sidebar";
import { useSelector } from 'react-redux';

const SidebarLayout = ({ children }) => {
  const role = useSelector((state) => state.user.role) || ROLE.GENERAL_USER;

  return (
    <div className="flex">
      {/* Sidebar fixed */}
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar role={role} />
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 p-6 overflow-y-auto h-screen ml-[240px]">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;