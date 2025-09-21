
import adminDashboardApi from "@/api/Admin_dashboard_api";
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
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchWeeklySales(selectedBranch);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const branchList = await adminDashboardApi.getBranches();
      setBranches(branchList || []);
      if (branchList && branchList.length > 0) setSelectedBranch(branchList[0].id);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchWeeklySales = async (branchId) => {
    try {
      const dashboardData = await adminDashboardApi.getDashboard();
      // Assuming backend sends weekly sales per branch
      const weeklySales = dashboardData.weekly_sales?.[branchId] || [];
      setSalesData(weeklySales);
    } catch (error) {
      console.error("Error fetching weekly sales:", error);
    }
  };

  return (
    <div className="bg-[#fff8f3] p-6 rounded-xl shadow-md border border-[#e4c8a8]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#5c4033]">
          📊 Weekly Sales Performance
        </h2>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border border-[#e4c8a8] p-2 rounded-lg bg-white text-[#5c4033]"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

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
