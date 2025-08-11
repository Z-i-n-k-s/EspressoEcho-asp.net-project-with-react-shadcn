import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock API call — replace with your backend endpoint
const fetchDailyDetailedData = async (date) => {
  // Replace with: fetch(`/api/sales/daily-details?date=${date}`)
  return {
    date,
    totalSales: 2200,
    totalProfit: 750,
    products: [
      { name: "Espresso", sold: 25, customers: 20, sales: 750 },
      { name: "Latte", sold: 18, customers: 15, sales: 540 },
      { name: "Cappuccino", sold: 10, customers: 8, sales: 300 },
      { name: "Pastries", sold: 7, customers: 6, sales: 200 },
    ],
  };
};

export default function SalesReport() {
  const [day, setDay] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    const loadDaily = async () => {
      const data = await fetchDailyDetailedData(day);
      setDailyData(data);
    };
    loadDaily();
  }, [day]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        ☕ Daily Sales Report
      </h1>

      {/* Date Picker */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-yellow-200 rounded-xl px-4 py-2 shadow">
          <Calendar className="text-[#6b4226]" />
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="bg-transparent outline-none text-[#6b4226] font-semibold"
          />
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-[#6b4226] mb-4 flex items-center gap-2">
          <TrendingUp /> Daily Summary
        </h2>
        {dailyData ? (
          <div className="space-y-2 text-[#7b5e4b] text-lg ">
            <p>
              <strong>Date:</strong> {dailyData.date}
            </p>
            <p>
              <strong>Total Sales:</strong> ৳
              {dailyData.totalSales.toLocaleString()}
            </p>
            <p>
              <strong>Total Profit:</strong> ৳
              {dailyData.totalProfit.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Select a date to view details</p>
        )}
      </div>

      {/* Product Breakdown */}
      <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-[#6b4226] mb-4 flex items-center gap-2">
          <Package /> Product Breakdown
        </h2>
        {dailyData ? (
          <table className="w-full text-left text-[#7b5e4b] text-lg">
            <thead>
              <tr className="border-b border-[#c89f94]">
                <th className="py-2">Product</th>
                <th className="py-2">Quantity Sold</th>
                <th className="py-2">Customers</th>
                <th className="py-2">Sales (৳)</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.products.map((p, idx) => (
                <tr key={idx} className="border-b border-[#f0e0d6]">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 pl-[calc(4.5%-1ch)]">{p.sold}</td>
                  <td className="py-2 pl-[calc(3.5%-1ch)]">{p.customers}</td>
                  <td className="py-2">৳{p.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No product data available</p>
        )}
      </div>

      {/* Sales Chart */}
      <div className="bg-[#fff8f1] rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-[#6b4226] mb-4">
          Product Sales Chart
        </h2>
        {dailyData && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData.products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#6b4226" name="Sales (৳)" />
              <Bar dataKey="sold" fill="#e6b17e" name="Times Sold" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
