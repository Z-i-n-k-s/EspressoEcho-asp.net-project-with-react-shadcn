import { Building2, DollarSign, Flame, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

export const KpiCard = () => {
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);
  // 📡 Fetch KPI Metrics
  const fetchDashboardMetrics = async () => {
    try {
      // const res = await fetch("/api/dashboard/metrics");
      // const data = await res.json();
      const data = [
        { icon: <Building2 />, label: "Total Branches", value: "12" },
        { icon: <Users />, label: "Employees", value: "85" },
        { icon: <DollarSign />, label: "Total Sales", value: "$152,300" },
        { icon: <Flame />, label: "Active Promotions", value: "3" },
      ];
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div className="bg-gradient-to-br from-[#fff5eb] to-[#f0d5b8] p-5 rounded-xl shadow-md border border-[#d8bfa5] hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
          <div key={i} className="flex items-center gap-4">
            <div className="text-white bg-[#8b5e3c] p-3 rounded-lg shadow-inner">
              {React.cloneElement(m.icon, { size: 22 })}
            </div>
            <div>
              <p className="text-sm text-[#704f34] font-medium tracking-wide">
                {m.label}
              </p>
              <p className="text-2xl font-extrabold text-[#3f2c1d]">
                {m.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
