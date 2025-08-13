import React from "react";

import { SalesChart } from "./SalesChart";
import { Alerts } from "./Alerts";
import { KpiCard } from "./KpiCard";

export default function ManagerDashboard() {
  // const [loading, setLoading] = useState(true);

  // // Fetch all dashboard data on mount
  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

  // const loadDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     await Promise.all([]);
  //   } catch (error) {
  //     console.error("Error loading dashboard:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      {/* "space-y-6 font-[Inter] bg-gradient-to-b from-[#f3e8dc] to-[#ede0d4] min-h-screen p-6 rounded-lg shadow-inner"> */}
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Manager Dashboard
      </h1>

      {/* {loading ? (
        <p className="text-center text-[#5c4033] italic">
          Loading dashboard...
        </p>
      ) : ( */}
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
      {/* )} */}
    </div>
  );
}
