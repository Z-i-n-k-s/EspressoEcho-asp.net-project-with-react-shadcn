import React from "react";
import ROLE from "@/lib/roles";
import Sidebar from "../../pages/shared-components/sidebar/Sidebar";

//const userRole = localStorage.getItem("role") || ROLE.ADMIN; 
//const userRole = localStorage.getItem("role") || ROLE.MANAGER; 
//const userRole = localStorage.getItem("role") || ROLE.STAFF; 
//const userRole = localStorage.getItem("role") || ROLE.CASHIER; 
 const userRole = localStorage.getItem("role") || ROLE.GENERAL_USER;

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar fixed */}
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar role={userRole} />
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 p-6 overflow-y-auto h-screen ml-[240px]">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
