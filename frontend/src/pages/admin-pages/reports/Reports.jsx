// src/pages/Reports.js
import { useEffect, useState } from "react";


import InventoryReport from "./InventoryReport";
import ReportFilter from "./ReportFilter";
import SalesChart from "./SalesChart";
import SalesSummary from "./SalesSummary";
import branchApi from "@/api/Branch_api";
import adminMonthlyReportApi from "@/api/Admin_monthly_report_api";

export default function Reports() {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Load branches from backend
  useEffect(() => {
    const loadBranches = async () => {
      setLoadingBranches(true);
      try {
        const res = await branchApi.getAllBranches();
        const branchList = res.data || res; // adjust depending on API response structure
        setBranches(branchList);
        if (branchList.length > 0) setBranch(branchList[0].id);
      } catch (err) {
        console.error("Error loading branches:", err);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  // Load monthly report from backend whenever branch or month changes
  useEffect(() => {
    if (!branch || !month) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await adminMonthlyReportApi.getMonthlyReport(branch, month);

        // Transform backend response to match component structure
        const formattedData = {
          branchName: data.branch_name,
          monthName: data.month,
          totalOrders: data.total_orders,
          onlineSales: data.online_sales,
          offlineSales: data.offline_sales,
          sales: data.product_breakdown.map((p) => ({
            name: p.product_name,
            quantity: p.quantity_sold,
            revenue: p.revenue,
            profit: p.profit,
          })),
          monthlyBreakdown: data.sales_trend.map((m) => ({
            label: m.month,
            online: m.online_sales,
            offline: m.offline_sales,
          })),
        };

        setMonthlyData(formattedData);
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [branch, month]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        📊 Monthly Report
      </h1>

      {loadingBranches ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading branches...
          </span>
        </div>
      ) : (
        <ReportFilter
          branch={branch}
          setBranch={setBranch}
          month={month}
          setMonth={setMonth}
          branches={branches}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading report data...
          </span>
        </div>
      ) : (
        monthlyData && (
          <>
            <SalesSummary monthlyData={monthlyData} />
            <SalesChart monthlyData={monthlyData} />
            <InventoryReport monthlyData={monthlyData} />
          </>
        )
      )}
    </div>
  );
}
