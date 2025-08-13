import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    fetchWeeklySales();
  }, []);

  // 📡 Fetch Weekly Sales Data
  const fetchWeeklySales = async () => {
    try {
      // const res = await fetch("/api/dashboard/sales");
      // const data = await res.json();
      const data = [
        { week: "Week 1", sales: 35000 },
        { week: "Week 2", sales: 42000 },
        { week: "Week 3", sales: 39000 },
        { week: "Week 4", sales: 46000 },
      ];
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching weekly sales:", error);
    }
  };

  return (
    <div className="bg-[#fff8f3] p-6 rounded-xl shadow-md border border-[#e4c8a8]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4">
        📊 Weekly Sales Performance
      </h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} barSize={40}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ecd4bc" />
            <XAxis dataKey="week" stroke="#6b4226" />
            <YAxis stroke="#6b4226" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#fff8f3",
                border: "1px solid #d8bfa5",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="sales" fill="#8b5e3c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
