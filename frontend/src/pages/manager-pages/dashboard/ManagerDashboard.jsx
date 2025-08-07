import React from "react";
import {
  TrendingUp,
  ShoppingCart,
  AlarmClock,
  Star,
  AlertTriangle,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const metrics = [
  { icon: <TrendingUp />, label: "Daily Sales", value: "$2,450" },
  { icon: <ShoppingCart />, label: "Orders Completed", value: "135" },
  { icon: <AlarmClock />, label: "Avg Order Time", value: "3m 22s" },
  { icon: <Star />, label: "Top Products", value: "Cappuccino" },
];

// Sample sales data for the chart
const salesData = [
  { day: "Mon", sales: 320 },
  { day: "Tue", sales: 450 },
  { day: "Wed", sales: 390 },
  { day: "Thu", sales: 510 },
  { day: "Fri", sales: 680 },
  { day: "Sat", sales: 860 },
  { day: "Sun", sales: 730 },
];

const ManagerDashboard = () => {
  return (
    <div className="space-y-6 font-[Inter] bg-gradient-to-b from-[#f3e8dc] to-[#ede0d4] min-h-screen p-6 rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Manager Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, index) => (
          <div
            key={index}
            className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition duration-200 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="text-[#6b4226] bg-[#e8d8c3] p-3 rounded-full">
                {m.icon}
              </div>
              <div>
                <p className="text-sm text-[#7b5e4b]">{m.label}</p>
                <p className="text-xl font-bold text-[#3f2c1d]">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Chart */}
        <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] h-73">
          <h2 className="text-lg font-semibold text-[#5c4033] mb-3">
            📈 Sales Overview
          </h2>
          <div className="h-48">
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c19a6b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#c19a6b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6b4226" />
                <YAxis stroke="#6b4226" />
                <CartesianGrid strokeDasharray="3 3" stroke="#e7dcd3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6f4e37"
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] h-72">
          <h2 className="text-lg font-semibold text-[#5c4033] mb-3 flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            Low Stock Alerts
          </h2>
          <ul className="text-base  text-[#7b5e4b] mt-3 space-y-2 list-disc list-inside">
            <li>Espresso Beans - 4 left</li>
            <li>Milk - 2 cartons</li>
            <li>Caramel Syrup - 1 bottle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
