import { useEffect, useState } from "react";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      // const res = await fetch("/api/dashboard/sales");
      // const data = await res.json();
      const data = [
        { day: "Mon", sales: 320 },
        { day: "Tue", sales: 450 },
        { day: "Wed", sales: 390 },
        { day: "Thu", sales: 510 },
        { day: "Fri", sales: 680 },
        { day: "Sat", sales: 860 },
        { day: "Sun", sales: 730 },
      ];
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  return (
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
  );
};
