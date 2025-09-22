import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export const SalesChart = ({ weeklySales = [] }) => {
  return (
    <div className="bg-[#fff8f3] p-6 rounded-xl shadow-md border border-[#e4c8a8]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4">
        📊 Weekly Sales Performance
      </h2>
      
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklySales} barSize={40}>
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