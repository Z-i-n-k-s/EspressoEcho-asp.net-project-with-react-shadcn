import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/user-without-login/landingPage/LandingPage";
import AboutUs from "../pages/user-without-login/about-us/AboutUs";
import { AdminDashboard } from "../pages/admin-pages/dashboard/AdminDashboard";
import ManagerDashboard from "../pages/manager-pages/dashboard/ManagerDashboard";
import StaffDashboard from "../pages/staff-pages/dashboard/StaffDashboard";
import CashierDashboard from "../pages/cashier-pages/dashboard/CashierDashboard";
import UserDashboard from "../pages/user-pages/dashboard/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ROLE from "../lib/roles";


// TEMP: get role from localStorage (replace with Context/Redux later)
const userRole = localStorage.getItem("role") || ROLE.GENERAL_USER;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },

      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]} userRole={userRole} />
        ),
        children: [
          {
            path: "admin-panel/admin-dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.MANAGER]} userRole={userRole} />
        ),
        children: [
          {
            path: "manager-panel/manager-dashboard",
            element: <ManagerDashboard />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STAFF]} userRole={userRole} />
        ),
        children: [
          {
            path: "staff-panel/staff-dashboard",
            element: <StaffDashboard />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.CASHIER]} userRole={userRole} />
        ),
        children: [
          {
            path: "cashier-panel/cashier-dashboard",
            element: <CashierDashboard />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute
            allowedRoles={[ROLE.GENERAL_USER]}
            userRole={userRole}
          />
        ),
        children: [
          {
            path: "user-panel/user-dashboard",
            element: <UserDashboard />,
          },
        ],
      },
    ],
  },
]);

export default router;
