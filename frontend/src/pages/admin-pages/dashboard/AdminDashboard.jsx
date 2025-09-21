import React, { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { SalesChart } from "./SalesChart";
import { Alerts } from "./Alerts";
import { BranchTable } from "./BranchTable";
import adminDashboardApi from "@/api/admin_dashboard_api";


export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminDashboardApi.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Admin Dashboard
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
          <KpiCard metrics={dashboardData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <Alerts alerts={dashboardData?.priority_alerts} />
          </div>
          <BranchTable branches={dashboardData?.branch_overview} />
        </>
      )}
    </div>
  );
};
