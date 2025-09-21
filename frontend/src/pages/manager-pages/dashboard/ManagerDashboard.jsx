import { useEffect, useState } from "react";
import { Alerts } from "./Alerts";
import { KpiCard } from "./KpiCard";
import { SalesChart } from "./SalesChart";
import managerDashboardApi from "@/api/manager_dashboard_api";


export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await managerDashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Manager Dashboard
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading dashboard...
          </span>
        </div>
      ) : (
        <>
          <KpiCard data={dashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={dashboardData?.sales_overview || []} />
            <Alerts data={dashboardData?.low_stock_alerts || []} />
          </div>
        </>
      )}
    </div>
  );
}
