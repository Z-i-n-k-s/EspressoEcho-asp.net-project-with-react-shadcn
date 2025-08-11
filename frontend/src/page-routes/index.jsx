import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/user-without-login/landingPage/LandingPage";
import AboutUs from "../pages/user-without-login/about-us/AboutUs";
import { AdminDashboard } from "../pages/admin-pages/dashboard/AdminDashboard";
import ManagerDashboard from "../pages/manager-pages/dashboard/ManagerDashboard";
import StaffDashboard from "../pages/staff-pages/dashboard/StaffDashboard";
import CashierDashboard from "../pages/cashier-pages/dashboard/CashierDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ROLE from "../lib/roles";
import SidebarLayout from "../layouts/sidebar-layout/SidebarLayout";
import BranchManagement from "../pages/admin-pages/Branch-Management/BranchManagement";
import Announcements from "../pages/admin-pages/announcements/Announcements";
import EmployeeManagement from "../pages/admin-pages/employee-management/EmployeeManagement";
import Reports from "../pages/admin-pages/reports/Reports";
import UserManagement from "../pages/admin-pages/user-management/UserManagement";
import FeedbackAndReviews from "../pages/admin-pages/feedback-reviews/FeedbackAndReviews";
import Promotions from "../pages/admin-pages/promotions/Promotions";
import InvertoryMangement from "../pages/manager-pages/inventory-management/InventoryManagement";
import Logout from "../pages/shared-components/logout/Logout";
import InventoryTransfer from "@/pages/manager-pages/inventory-transfer/InventoryTransfer";
import DailyReports from "@/pages/manager-pages/daily-reports/DailyReports";
import EmployeePerformance from "@/pages/manager-pages/employee-performance/EmployeePerformance";
import CustomerFeedback from "@/pages/manager-pages/customer-feedback/CustomerFeedback";
import WorkHistory from "@/pages/staff-pages/work-history/WorkHistory";
import OnlineOrderProcessing from "@/pages/cashier-pages/online-orders/OnlineOrderProcessing";
import UserPromotions from "@/pages/user-pages/promotions/UserPromotions";
import UserOrders from "@/pages/user-pages/user-orders/UserOrders";
import UserReviews from "@/pages/user-pages/user-review/UserReviews";
import UserFeedback from "@/pages/user-pages/user-feedback/UserFeedback";
import UserBuyPage from "../pages/user-pages/user-buy-page/UserBuyPage";
import UserCart from "@/pages/user-pages/user-cart/UserCart";
import UserStats from "@/pages/user-pages/user-stats/UserStats";
import Menu from "@/pages/user-without-login/componets/Menu";
import AboutPreview from "@/pages/user-without-login/about-us/AboutPreview";
import Reviews from "@/pages/user-without-login/componets/Reviews";
import Contact from "@/pages/user-without-login/componets/Contact";
import InteriorImages from "@/pages/user-without-login/componets/InteriorImages";
import MenuUser from "@/pages/user-without-login/menu-user/MenuUser";
import AllMenu from "@/pages/user-without-login/menu-user/AllMenu";
import SliderAbout from "@/pages/user-without-login/about-us/SliderAbout";
import Branches from "@/pages/user-without-login/branches/Branches";
import ScrollSection from "@/pages/user-without-login/componets/ScrollSection";

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
        path: "/menu",
        element: <Menu></Menu>,
      },
        {
        path: "/menu-user",
        element: <MenuUser></MenuUser>
      },
      {
        path: "/all-menu",
        element: <AllMenu></AllMenu>
      },
       {
        path: "/about-preview",
        element: <AboutPreview></AboutPreview>,
      },
           {
        path: "/slider-about",
        element: <SliderAbout></SliderAbout>
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/reviews",
        element: <Reviews></Reviews>
      },
        {
        path: "/scroll-section",
        element: <ScrollSection></ScrollSection>
      },
       {
        path: "/contact",
        element: <Contact></Contact>
      },
        {
        path: "/interior-images",
        element: <InteriorImages></InteriorImages>
      },
        {
        path: "/branches",
        element: <Branches></Branches>
      },

      // 🔹 Admin Routes
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]} userRole={userRole} />
        ),
        children: [
          {
            path: "admin-panel/admin-dashboard",
            element: (
              <SidebarLayout>
                <AdminDashboard />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/branches",
            element: (
              <SidebarLayout>
                <BranchManagement />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/announcements",
            element: (
              <SidebarLayout>
                <Announcements />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/employees",
            element: (
              <SidebarLayout>
                <EmployeeManagement />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/reports",
            element: (
              <SidebarLayout>
                <Reports />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/users",
            element: (
              <SidebarLayout>
                <UserManagement />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/feedback",
            element: (
              <SidebarLayout>
                <FeedbackAndReviews />
              </SidebarLayout>
            ),
          },
          {
            path: "admin-panel/promotions",
            element: (
              <SidebarLayout>
                <Promotions />
              </SidebarLayout>
            ),
          },
          {
            path: "/logout",
            element: (
              <SidebarLayout>
                <Logout/>
              </SidebarLayout>
            ),
          },
        ],
      },

      // 🔹 Manager Routes
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.MANAGER]} userRole={userRole} />
        ),
        children: [
          {
            path: "manager-panel/manager-dashboard",
            element: (
              <SidebarLayout>
                <ManagerDashboard />
              </SidebarLayout>
            ),
          },
          {
            path: "manager-panel/inventory",
            element: (
              <SidebarLayout>
                <InvertoryMangement />
              </SidebarLayout>
            ),
          },
          {
            path: "manager-panel/transfer",
            element: (
              <SidebarLayout>
                <InventoryTransfer />
              </SidebarLayout>
            ),
          },
          {
            path: "manager-panel/reports",
            element: (
              <SidebarLayout>
                <DailyReports />
              </SidebarLayout>
            ),
          },
          {
            path: "manager-panel/employees",
            element: (
              <SidebarLayout>
                <EmployeePerformance />
              </SidebarLayout>
            ),
          },
          {
            path: "manager-panel/feedback",
            element: (
              <SidebarLayout>
                <CustomerFeedback />
              </SidebarLayout>
            ),
          },
          {
            path: "/logout",
            element: (
              <SidebarLayout>
                <Logout />
              </SidebarLayout>
            ),
          },
        ],
      },

      // 🔹 Staff Routes
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STAFF]} userRole={userRole} />
        ),
        children: [
          {
            path: "staff-panel/staff-dashboard",
            element: (
              <SidebarLayout>
                <StaffDashboard />
              </SidebarLayout>
            ),
          },
          {
            path: "staff-panel/history",
            element: (
              <SidebarLayout>
                <WorkHistory />
              </SidebarLayout>
            ),
          },
          {
            path: "/logout",
            element: (
              <SidebarLayout>
                <Logout />
              </SidebarLayout>
            ),
          },
        ],
      },

      // 🔹 Cashier Routes
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLE.CASHIER]} userRole={userRole} />
        ),
        children: [
          {
            path: "cashier-panel/cashier-dashboard",
            element: (
              <SidebarLayout>
                <CashierDashboard />
              </SidebarLayout>
            ),
          },
          {
            path: "cashier-panel/online-orders",
            element: (
              <SidebarLayout>
                <OnlineOrderProcessing />
              </SidebarLayout>
            ),
          },
          {
            path: "/logout",
            element: (
              <SidebarLayout>
                <Logout />
              </SidebarLayout>
            ),
          },
        ],
      },

      // 🔹 User Routes
      {
        element: (
          <ProtectedRoute
            allowedRoles={[ROLE.GENERAL_USER]}
            userRole={userRole}
          />
        ),
        children: [
          {
            path: "user-panel/buy-now",
            element: (
              <SidebarLayout>
                <UserBuyPage />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/cart",
            element: (
              <SidebarLayout>
                <UserCart />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/stats",
            element: (
              <SidebarLayout>
                <UserStats />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/promotions",
            element: (
              <SidebarLayout>
                <UserPromotions />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/orders",
            element: (
              <SidebarLayout>
                <UserOrders />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/reviews",
            element: (
              <SidebarLayout>
                <UserReviews />
              </SidebarLayout>
            ),
          },
          {
            path: "user-panel/feedback",
            element: (
              <SidebarLayout>
                <UserFeedback />
              </SidebarLayout>
            ),
          },
          {
            path: "/logout",
            element: (
              <SidebarLayout>
                <Logout />
              </SidebarLayout>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
