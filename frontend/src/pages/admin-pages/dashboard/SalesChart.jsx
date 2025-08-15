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

  // 📌 Fetch Branch List
  const fetchBranches = async () => {
    try {
      // Replace with your backend API
      // const res = await fetch("/api/branches");
      // const data = await res.json();
      const data = [
        { id: "1", name: "Central Coffee Hub" },
        { id: "2", name: "Northside Cafe" },
        { id: "3", name: "Lakeside Brew" },
      ];
      setBranches(data);
      setSelectedBranch(data[0].id); // default to first branch
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // 📡 Fetch Weekly Sales Data for a Branch
  const fetchWeeklySales = async (branchId) => {
    try {
      // const res = await fetch(`/api/dashboard/sales?branchId=${branchId}`);
      // const data = await res.json();

      // Mock data based on branchId
      const branchSales = {
        "1": [
          { week: "Week 1", sales: 35000 },
          { week: "Week 2", sales: 42000 },
          { week: "Week 3", sales: 39000 },
          { week: "Week 4", sales: 46000 },
        ],
        "2": [
          { week: "Week 1", sales: 25000 },
          { week: "Week 2", sales: 31000 },
          { week: "Week 3", sales: 28000 },
          { week: "Week 4", sales: 33000 },
        ],
        "3": [
          { week: "Week 1", sales: 41000 },
          { week: "Week 2", sales: 44000 },
          { week: "Week 3", sales: 47000 },
          { week: "Week 4", sales: 50000 },
        ],
      };

      setSalesData(branchSales[branchId] || []);
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
