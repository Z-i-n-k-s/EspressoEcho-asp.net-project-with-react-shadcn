import React, { useState } from "react";
import { Calendar, User, ShoppingBag, DollarSign, Clock, Package, CheckCircle, Coffee } from "lucide-react";
import Details from "./Details";

const WorkHistory = () => {
  const [selectedWork, setSelectedWork] = useState(null);

  // Demo data for completed orders (converted from pending to completed)
  const completedWorks = [
    {
      id: "order-001",
      customer_name: "John Doe",
      customer_phone: "+1 (555) 123-4567",
      order_type: "delivery",
      order_status: "completed",
      total_amount: 18.5,
      placed_at: "2025-08-14T09:30:00",
      completed_at: "2025-08-14T10:20:00",
      delivery_address: {
        street: "123 Oak Street, Apt 4B",
        city: "Downtown",
        postal_code: "12345",
        instructions: "Ring doorbell twice, leave at door",
      },
      estimated_delivery: "2025-08-14T10:15:00",
      delivery_fee: 2.99,
      items: [
        {
          product_id: "prod-1",
          name: "Cappuccino",
          image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center",
          quantity: 2,
          unit_price: 4.5,
        },
        {
          product_id: "prod-2",
          name: "Chocolate Croissant",
          image_url: "https://images.unsplash.com/photo-1555507036-ab794f04d2fb?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 3.5,
        },
        {
          product_id: "prod-3",
          name: "Americano",
          image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 6.0,
        },
      ],
    },
    {
      id: "order-002",
      customer_name: "Sarah Wilson",
      customer_phone: "+1 (555) 987-6543",
      order_type: "pickup",
      order_status: "completed",
      total_amount: 15.75,
      placed_at: "2025-08-13T09:45:00",
      completed_at: "2025-08-13T10:35:00",
      pickup_time: "2025-08-13T10:30:00",
      items: [
        {
          product_id: "prod-4",
          name: "Latte",
          image_url: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=100&h=100&fit=crop&crop=center",
          quantity: 2,
          unit_price: 5.25,
        },
        {
          product_id: "prod-5",
          name: "Blueberry Muffin",
          image_url: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 5.25,
        },
      ],
    },
    {
      id: "order-003",
      customer_name: "Mike Johnson",
      customer_phone: "+1 (555) 456-7890",
      order_type: "home_delivery",
      order_status: "completed",
      total_amount: 25.5,
      placed_at: "2025-08-12T10:15:00",
      completed_at: "2025-08-12T11:10:00",
      delivery_address: {
        street: "789 Maple Drive, House #12",
        city: "Residential Area",
        postal_code: "12347",
        instructions: "Call when arrived, front door delivery",
        is_home: true,
        landmark: "Blue house with white fence",
      },
      estimated_delivery: "2025-08-12T11:00:00",
      delivery_fee: 3.5,
      items: [
        {
          product_id: "prod-1",
          name: "Cappuccino",
          image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 4.5,
        },
        {
          product_id: "prod-6",
          name: "Espresso",
          image_url: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=100&h=100&fit=crop&crop=center",
          quantity: 3,
          unit_price: 3.5,
        },
        {
          product_id: "prod-7",
          name: "Avocado Toast",
          image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 7.5,
        },
      ],
    },
    {
      id: "order-004",
      customer_name: "Emily Chen",
      customer_phone: "+1 (555) 321-9876",
      order_type: "delivery",
      order_status: "completed",
      total_amount: 19.25,
      placed_at: "2025-08-11T10:30:00",
      completed_at: "2025-08-11T11:25:00",
      delivery_address: {
        street: "456 Pine Avenue, Suite 201",
        city: "Business District",
        postal_code: "12346",
        instructions: "Call when arrived, office building reception",
      },
      estimated_delivery: "2025-08-11T11:15:00",
      delivery_fee: 2.99,
      items: [
        {
          product_id: "prod-4",
          name: "Latte",
          image_url: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=100&h=100&fit=crop&crop=center",
          quantity: 3,
          unit_price: 5.25,
        },
        {
          product_id: "prod-2",
          name: "Chocolate Croissant",
          image_url: "https://images.unsplash.com/photo-1555507036-ab794f04d2fb?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 3.5,
        },
      ],
    },
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderTypeStyle = (type) => {
    switch (type) {
      case 'pickup':
        return 'bg-green-100 text-green-800';
      case 'delivery':
      case 'home_delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'delivery':
      case 'home_delivery':
        return <Package size={16} />;
      case 'pickup':
        return <Coffee size={16} />;
      default:
        return <ShoppingBag size={16} />;
    }
  };

  const totalRevenue = completedWorks.reduce((sum, work) => sum + work.total_amount, 0);
  const totalItems = completedWorks.reduce((sum, work) => sum + work.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-600 rounded-xl shadow-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-600">Track your completed coffee shop orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{completedWorks.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${(totalRevenue / completedWorks.length).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Package className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Items Sold</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Coffee className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {completedWorks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Recent Completed Orders</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {completedWorks.map((work) => (
                    <tr
                      key={work.id}
                      className="hover:bg-amber-50 cursor-pointer transition-all duration-200 group"
                      onClick={() => setSelectedWork(work)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 group-hover:text-amber-700">
                          {work.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900 font-medium">{formatDate(work.placed_at)}</div>
                        <div className="text-sm text-gray-500">{formatTime(work.placed_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {work.customer_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium">{work.customer_name}</div>
                            <div className="text-sm text-gray-500">{work.customer_phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getOrderTypeStyle(work.order_type)}`}>
                          {getOrderTypeIcon(work.order_type)}
                          {work.order_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {work.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        ${work.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-green-600 font-medium text-sm capitalize">{work.order_status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders yet</h3>
            <p className="text-gray-500">Your completed coffee shop orders will appear here.</p>
          </div>
        )}

        {/* Details Modal */}
        <Details selectedWork={selectedWork} setSelectedWork={setSelectedWork} />
      </div>
    </div>
  );
};

export default WorkHistory;