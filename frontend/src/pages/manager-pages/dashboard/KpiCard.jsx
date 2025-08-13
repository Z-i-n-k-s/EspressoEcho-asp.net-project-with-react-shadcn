import { AlarmClock, ShoppingCart, Star, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

export const KpiCard = () => {
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      // Example placeholder data (replace with API call)
      // const res = await fetch("/api/dashboard/metrics");
      // const data = await res.json();
      const data = [
        { icon: <TrendingUp />, label: "Daily Sales", value: "$2,450" },
        { icon: <ShoppingCart />, label: "Orders Completed", value: "135" },
        { icon: <AlarmClock />, label: "Avg Order Time", value: "3m 22s" },
        { icon: <Star />, label: "Top Products", value: "Cappuccino" },
      ];
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
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
  );
};
