import { useEffect, useState } from "react";
import { Alerts } from "./Alerts";
import { KpiCard } from "./KpiCard";
import { SalesChart } from "./SalesChart";

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); //simulate api delay show loading
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      {/* "space-y-6 font-[Inter] bg-gradient-to-b from-[#f3e8dc] to-[#ede0d4] min-h-screen p-6 rounded-lg shadow-inner"> */}
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Manager Dashboard
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading branches...
          </span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <KpiCard />

          {/* Sales Chart and Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview Chart */}
            <SalesChart />

            {/* Low Stock Alerts */}
            <Alerts />
          </div>
        </>
      )}
    </div>
  );
}
