import React from "react";
import ROLE from "@/lib/roles";
import Sidebar from "../../pages/shared-components/sidebar/Sidebar";

//const userRole = localStorage.getItem("role") || ROLE.ADMIN;
const userRole = localStorage.getItem("role") || ROLE.MANAGER;
// const userRole = localStorage.getItem("role") || ROLE.STAFF;
 //const userRole = localStorage.getItem("role") || ROLE.CASHIER;
//const userRole = localStorage.getItem("role") || ROLE.GENERAL_USER;

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar role={userRole} />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default SidebarLayout;
