import React from "react";

import { KpiCard } from "./KpiCard";
import { SalesChart } from "./SalesChart";
import { Alerts } from "./Alerts";
import { BranchTable } from "./BranchTable";

export const AdminDashboard = () => {
  //const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

  // // Load all dashboard data in parallel
  // const loadDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     await Promise.all([]);
  //   } catch (error) {
  //     console.error("Error loading admin dashboard:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Admin Dashboard
      </h1>

      {/* {loading ? (
        <p className="text-center text-[#5c4033] italic">
          Loading dashboard...
        </p>
      ) : ( */}
        <>
        
          {/* KPI Cards */}
          <KpiCard />

          {/* Sales Overview + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/*Sales Bar Chart */}
            <div className="lg:col-span-2 ">
              <SalesChart />
            </div>

            {/* Alerts */}
            <Alerts />
          </div>

          {/* Branch Table */}
          <BranchTable />
        </>
      {/* )} */}
    </div>
  );
};
