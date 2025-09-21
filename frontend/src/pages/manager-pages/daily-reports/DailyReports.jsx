import { useEffect, useState } from "react";
import DailySummary from "./DailySummary";
import DateSelector from "./DateSelector";
import ProductBreakdown from "./ProductBreakdown";
import SalesChart from "./SalesChart";
import dailySalesReportApi from "@/api/Daily_sales";


export default function SalesReport() {
  const [day, setDay] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  useEffect(() => {
    const loadDaily = async () => {
      setLoading(true);
      setError("");
      setDailyData(null);

      try {
        const res = await dailySalesReportApi.getDailyReport(day);

        // If backend sends message "No data available", handle it
        if (res.message === "No data available") {
          setDailyData({ totalSales: 0 });
          return;
        }

        // Map backend response → frontend shape
        const mappedData = {
          date: res.date,
          totalSales: res.total_sales,
          totalProfit: res.total_profit,
          salesPercentage: res.sales_percentage,
          products: res.product_breakdown.map((p) => ({
            name: p.product_name,
            sold: p.quantity_sold,
            customers: p.customers,
            sales: p.sales,
          })),
        };

        setDailyData(mappedData);
      } catch (err) {
        console.error("Failed to fetch daily sales report:", err);
        setError(
          err?.response?.data?.error ||
            "Failed to fetch report. Please try another date."
        );
      } finally {
        setLoading(false);
      }
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading Reports...
          </span>
        </div>
      ) : error ? (
        <p className="text-red-500 py-12 text-center">{error}</p>
      ) : dailyData?.totalSales === 0 ? (
        <p className="text-[#6b4226] py-12 text-center">
          No data available for the selected date
        </p>
      ) : (
        <>
          {/* Daily Summary */}
          <DailySummary dailyData={dailyData} />

          {/* Product Breakdown */}
          <ProductBreakdown dailyData={dailyData} />

          {/* Sales Chart */}
          <SalesChart dailyData={dailyData} />
        </>
      )}
    </div>
  );
}
