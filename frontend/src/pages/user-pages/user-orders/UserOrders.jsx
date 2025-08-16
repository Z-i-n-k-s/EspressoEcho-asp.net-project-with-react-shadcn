import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  Coffee,
  Package,
  Truck,
  Star,
  MapPin,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import OrderList from "./OrderList";
import Header from "@/pages/user-without-login/componets/Header";

const UserOrders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Demo orders data
  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-08-15",
      time: "14:30",
      status: "delivered",
      items: [
        {
          name: "Cappuccino",
          quantity: 2,
          price: 3.5,
          image:
            "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200",
        },
        {
          name: "Croissant",
          quantity: 1,
          price: 2.8,
          image:
            "https://images.unsplash.com/photo-1555507036-ab794f4aaaef?w=200",
        },
      ],
      total: 9.8,
      estimatedTime: "15-20 min",
      actualTime: "18 min",
      rating: 5,
      address: "123 Main St, Downtown",
    },
    {
      id: "ORD-2024-002",
      date: "2024-08-15",
      time: "16:45",
      status: "preparing",
      items: [
        {
          name: "Iced Latte",
          quantity: 1,
          price: 4.2,
          image:
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200",
        },
        {
          name: "Blueberry Muffin",
          quantity: 2,
          price: 2.5,
          image:
            "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200",
        },
      ],
      total: 9.2,
      estimatedTime: "12-15 min",
      timeRemaining: "8 min",
      address: "456 Oak Avenue, Midtown",
    },
    {
      id: "ORD-2024-003",
      date: "2024-08-14",
      time: "09:15",
      status: "ready",
      items: [
        {
          name: "Espresso",
          quantity: 1,
          price: 2.8,
          image:
            "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200",
        },
        {
          name: "Almond Croissant",
          quantity: 1,
          price: 3.2,
          image:
            "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=200",
        },
      ],
      total: 6.0,
      estimatedTime: "10-12 min",
      address: "789 Pine Street, Uptown",
    },
    {
      id: "ORD-2024-004",
      date: "2024-08-13",
      time: "11:20",
      status: "cancelled",
      items: [
        {
          name: "Frappuccino",
          quantity: 1,
          price: 5.5,
          image:
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200",
        },
      ],
      total: 5.5,
      refundAmount: 5.5,
      address: "321 Elm Street, Downtown",
    },
  ]);

  const statusConfig = {
    preparing: {
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      icon: Clock,
      label: "Preparing",
    },
    ready: {
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: Package,
      label: "Ready for Pickup",
    },
    delivered: {
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: CheckCircle,
      label: "Delivered",
    },
    cancelled: {
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      icon: RefreshCw,
      label: "Cancelled",
    },
  };

  const filterOptions = [
    { key: "all", label: "All Orders", count: orders.length },
    {
      key: "preparing",
      label: "Preparing",
      count: orders.filter((o) => o.status === "preparing").length,
    },
    {
      key: "ready",
      label: "Ready",
      count: orders.filter((o) => o.status === "ready").length,
    },
    {
      key: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      selectedFilter === "all" || order.status === selectedFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const handleRateOrder = (orderId, rating) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, rating } : order
      )
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const RatingStars = ({ rating, orderId, editable = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${editable ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => editable && handleRateOrder(orderId, star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e5c185]">
      <Header></Header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-block text-[#4e342e] mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">My Orders</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Track your coffee journey
          </p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[#d9c4a8] backdrop-blur-sm border border-gray-200 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 
                         transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-lg hover:shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto justify-center">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedFilter === filter.key
                  ? "bg-[#4e342e]  text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white/90 hover:shadow-md"
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedFilter === filter.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <OrderList
          filteredOrders={filteredOrders}
          searchQuery={searchQuery}
          statusConfig={statusConfig}
          formatDate={formatDate}
          RatingStars={RatingStars}
        />
      </div>
    </div>
  );
};

export default UserOrders;
