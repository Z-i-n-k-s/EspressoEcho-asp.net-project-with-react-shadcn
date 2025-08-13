import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Users,
  ClipboardList,
  UserCog,
  MessageSquare,
  Percent,
  Shuffle,
  Package,
  ClipboardCheck,
  History,
  ShoppingCart,
  ListOrdered,
  Gift,
  Star,
  LogOut,
  Zap,
  BarChart3,
} from "lucide-react";

import ROLE from "@/lib/roles";

export const sidebarMenus = {
  [ROLE.ADMIN]: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin-panel/admin-dashboard" },
    { icon: Building2, label: "Branch Management", path: "/admin-panel/branches" },
    { icon: Package, label:"Product Management", path: "/admin-panel/products" },
    { icon: Megaphone, label: "Announcements", path: "/admin-panel/announcements" },
    { icon: Users, label: "Employee Management", path: "/admin-panel/employees" },
    { icon: ClipboardList, label: "Reports", path: "/admin-panel/reports" },
    { icon: UserCog, label: "User Management", path: "/admin-panel/users" },
    { icon: MessageSquare, label: "Feedback & Reviews", path: "/admin-panel/feedback" },
    { icon: Percent, label: "Promotions", path: "/admin-panel/promotions" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ],

  [ROLE.MANAGER]: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/manager-panel/manager-dashboard" },
    { icon: Package, label: "Inventory Management", path: "/manager-panel/inventory" },
    { icon: Shuffle, label: "Inventory Transfer", path: "/manager-panel/transfer" },
    { icon: ClipboardList, label: "Daily Report", path: "/manager-panel/reports" },
    { icon: Users, label: "Employee Performance", path: "/manager-panel/employees" },
    { icon: MessageSquare, label: "Customer Feedback", path: "/manager-panel/feedback" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ],

  [ROLE.STAFF]: [
    { icon: ClipboardCheck, label: "Assigned Work", path: "/staff-panel/staff-dashboard" },
    { icon: History, label: "Work History", path: "/staff-panel/history" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ],

  [ROLE.CASHIER]: [
    { icon: ShoppingCart, label: "POS", path: "/cashier-panel/cashier-dashboard" },
    { icon: ListOrdered, label: "Order Processing", path: "/cashier-panel/online-orders" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ],

  [ROLE.GENERAL_USER]: [
    { icon: Zap, label: "Buy Now", path: "/user-panel/buy-now" },       // entry page
    { icon: ShoppingCart, label: "Cart", path: "/user-panel/cart" },    // 🛒 cart
    { icon: BarChart3, label: "Stats", path: "/user-panel/stats" },     // 📊 static stats
    { icon: Gift, label: "Promotions", path: "/user-panel/promotions" },
    { icon: ListOrdered, label: "My Orders", path: "/user-panel/orders" },
    { icon: Star, label: "My Reviews", path: "/user-panel/reviews" },
    { icon: MessageSquare, label: "Feedback & Support", path: "/user-panel/feedback" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ],
};
