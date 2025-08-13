import React, { useState, useEffect } from "react";
import DateSelector from "./DateSelector";
import DailySummary from "./DailySummary";
import ProductBreakdown from "./ProductBreakdown";
import SalesChart from "./SalesChart";

// Mock API call — replace with your backend endpoint
const fetchDailyDetailedData = async (date) => {
  // Replace with: fetch(`/api/sales/daily-details?date=${date}`)
  return {
    date,
    totalSales: 2200,
    totalProfit: 750,
    products: [
      { name: "Espresso", sold: 30, customers: 50, sales: 750 },
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
        <DateSelector date={day} onChange={setDay} />
      </div>

      {/* Daily Summary */}
      <DailySummary dailyData={dailyData} />

      {/* Sales Overview */}

      {/* Product Breakdown */}
      <ProductBreakdown dailyData={dailyData} />

      {/* Sales Chart */}
      <SalesChart dailyData={dailyData} />
    </div>
  );
}
