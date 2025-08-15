import { useEffect, useState } from "react";
import InventoryReport from "./InventoryReport";
import ReportFilter from "./ReportFilter";
import SalesChart from "./SalesChart";
import SalesSummary from "./SalesSummary";

// ---- Mock data ----
const BRANCHES = {
  "1": {
    branchName: "Central Coffee Hub",
    inventory: [
      { name: "Espresso Beans", stock: 25, unit: "kg" },
      { name: "Milk", stock: 15, unit: "liters" },
      { name: "Pastries", stock: 10, unit: "pieces" },
      { name: "Sugar", stock: 18, unit: "kg" },
      { name: "Coffee Filters", stock: 35, unit: "boxes" },
    ],
    monthly: [
      { online: 1100, offline: 2500, orders: 450, sales: [
        { name: "Espresso Beans", quantity: 120, revenue: 1800, profit: 900 },
        { name: "Milk", quantity: 80, revenue: 240, profit: 120 },
        { name: "Pastries", quantity: 150, revenue: 750, profit: 300 },
        { name: "Sugar", quantity: 60, revenue: 90, profit: 40 },
      ]},
      { online: 1120, offline: 2000, orders: 459, sales: [
        { name: "Espresso Beans", quantity: 125, revenue: 1875, profit: 940 },
        { name: "Milk", quantity: 85, revenue: 255, profit: 130 },
        { name: "Pastries", quantity: 155, revenue: 775, profit: 310 },
        { name: "Sugar", quantity: 65, revenue: 95, profit: 45 },
      ]},
      { online: 1150, offline: 1800, orders: 469, sales: [
        { name: "Espresso Beans", quantity: 130, revenue: 1950, profit: 980 },
        { name: "Milk", quantity: 88, revenue: 264, profit: 135 },
        { name: "Pastries", quantity: 160, revenue: 800, profit: 320 },
        { name: "Sugar", quantity: 68, revenue: 102, profit: 50 },
      ]},
      { online: 1180, offline: 1900, orders: 479, sales: [
        { name: "Espresso Beans", quantity: 135, revenue: 2025, profit: 1020 },
        { name: "Milk", quantity: 90, revenue: 270, profit: 140 },
        { name: "Pastries", quantity: 165, revenue: 825, profit: 330 },
        { name: "Sugar", quantity: 70, revenue: 105, profit: 52 },
      ]},
      { online: 1200, offline: 1700, orders: 488, sales: [
        { name: "Espresso Beans", quantity: 140, revenue: 2100, profit: 1050 },
        { name: "Milk", quantity: 92, revenue: 276, profit: 145 },
        { name: "Pastries", quantity: 170, revenue: 850, profit: 340 },
        { name: "Sugar", quantity: 72, revenue: 108, profit: 54 },
      ]},
      { online: 1220, offline: 2750, orders: 496, sales: [
        { name: "Espresso Beans", quantity: 142, revenue: 2130, profit: 1070 },
        { name: "Milk", quantity: 94, revenue: 282, profit: 148 },
        { name: "Pastries", quantity: 172, revenue: 860, profit: 344 },
        { name: "Sugar", quantity: 74, revenue: 111, profit: 56 },
      ]},
      { online: 1250, offline: 2800, orders: 506, sales: [
        { name: "Espresso Beans", quantity: 145, revenue: 2175, profit: 1090 },
        { name: "Milk", quantity: 96, revenue: 288, profit: 150 },
        { name: "Pastries", quantity: 175, revenue: 875, profit: 350 },
        { name: "Sugar", quantity: 76, revenue: 114, profit: 58 },
      ]},
      { online: 1200, offline: 2800, orders: 500, sales: [
        { name: "Espresso Beans", quantity: 144, revenue: 2160, profit: 1080 },
        { name: "Milk", quantity: 95, revenue: 285, profit: 148 },
        { name: "Pastries", quantity: 174, revenue: 870, profit: 348 },
        { name: "Sugar", quantity: 75, revenue: 113, profit: 57 },
      ]},
      { online: 1180, offline: 2700, orders: 485, sales: [
        { name: "Espresso Beans", quantity: 140, revenue: 2100, profit: 1050 },
        { name: "Milk", quantity: 93, revenue: 279, profit: 145 },
        { name: "Pastries", quantity: 170, revenue: 850, profit: 340 },
        { name: "Sugar", quantity: 73, revenue: 110, profit: 55 },
      ]},
      { online: 1150, offline: 2650, orders: 475, sales: [
        { name: "Espresso Beans", quantity: 138, revenue: 2070, profit: 1030 },
        { name: "Milk", quantity: 91, revenue: 273, profit: 142 },
        { name: "Pastries", quantity: 168, revenue: 840, profit: 336 },
        { name: "Sugar", quantity: 72, revenue: 108, profit: 54 },
      ]},
      { online: 1120, offline: 2600, orders: 465, sales: [
        { name: "Espresso Beans", quantity: 135, revenue: 2025, profit: 1020 },
        { name: "Milk", quantity: 89, revenue: 267, profit: 138 },
        { name: "Pastries", quantity: 165, revenue: 825, profit: 330 },
        { name: "Sugar", quantity: 70, revenue: 105, profit: 52 },
      ]},
      { online: 1100, offline: 2550, orders: 456, sales: [
        { name: "Espresso Beans", quantity: 130, revenue: 1950, profit: 980 },
        { name: "Milk", quantity: 88, revenue: 264, profit: 135 },
        { name: "Pastries", quantity: 160, revenue: 800, profit: 320 },
        { name: "Sugar", quantity: 68, revenue: 102, profit: 50 },
      ]},
    ],
  },

  "2": {
    branchName: "Northside Branch",
    inventory: [
      { name: "Espresso Beans", stock: 20, unit: "kg" },
      { name: "Milk", stock: 12, unit: "liters" },
      { name: "Pastries", stock: 8, unit: "pieces" },
      { name: "Sugar", stock: 15, unit: "kg" },
      { name: "Coffee Filters", stock: 30, unit: "boxes" },
    ],
    monthly: Array.from({ length: 12 }, (_, i) => ({
      online: 800 + i * 20,
      offline: 1900 + i * 30,
      orders: 340 + i * 5,
      sales: [
        { name: "Espresso Beans", quantity: 90 + i * 2, revenue: (90 + i * 2) * 15, profit: (90 + i * 2) * 7.5 },
        { name: "Milk", quantity: 70 + i, revenue: (70 + i) * 3, profit: (70 + i) * 1.5 },
        { name: "Pastries", quantity: 120 + i * 3, revenue: (120 + i * 3) * 5, profit: (120 + i * 3) * 2 },
      ],
    })),
  },

  "3": {
    branchName: "Eastside Branch",
    inventory: [
      { name: "Espresso Beans", stock: 28, unit: "kg" },
      { name: "Milk", stock: 17, unit: "liters" },
      { name: "Pastries", stock: 12, unit: "pieces" },
      { name: "Sugar", stock: 20, unit: "kg" },
      { name: "Coffee Filters", stock: 40, unit: "boxes" },
    ],
    monthly: Array.from({ length: 12 }, (_, i) => ({
      online: 1400 + i * 20,
      offline: 2850 + i * 30,
      orders: 530 + i * 5,
      sales: [
        { name: "Espresso Beans", quantity: 150 + i * 3, revenue: (150 + i * 3) * 15, profit: (150 + i * 3) * 7.5 },
        { name: "Milk", quantity: 100 + i * 2, revenue: (100 + i * 2) * 3, profit: (100 + i * 2) * 1.5 },
        { name: "Pastries", quantity: 200 + i * 4, revenue: (200 + i * 4) * 5, profit: (200 + i * 4) * 2 },
      ],
    })),
  },
};


// ---- Mock fetchBranches (replace with API later) ----
const fetchBranches = async () => {
  await new Promise((r) => setTimeout(r, 250)); // fake delay
  return [
    { id: "1", name: "Central Coffee Hub" },
    { id: "2", name: "Northside Branch" },
    { id: "3", name: "Eastside Branch" },
  ];
};

// ---- Mock fetch monthly data ----
const fetchBranchMonthlyData = async (branchId, monthYear) => {
  await new Promise((r) => setTimeout(r, 250));

  const cfg = BRANCHES[branchId];
  if (!cfg) throw new Error("Unknown branch");

  const [yearStr, monthStr] = monthYear.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  const monthlyBreakdown = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, monthIndex - i, 1);
    const idx = d.getMonth();
    const m = cfg.monthly[idx];
    monthlyBreakdown.push({
      name: d.toLocaleDateString("en-US", { month: "short" }),
      label: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      online: m.online,
      offline: m.offline,
    });
  }

  const current = cfg.monthly[monthIndex];
  return {
    branchName: cfg.branchName,
    totalOrders: current.orders,
    onlineSales: current.online,
    offlineSales: current.offline,
    inventory: cfg.inventory,
    sales: current.sales, // added sales data
    monthlyBreakdown,
    month: monthYear,
    year: String(year),
    monthName: new Date(year, monthIndex, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
};

export default function Reports() {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7);
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
        const data = await fetchBranches();
        setBranches(data);
        if (data.length > 0) setBranch(data[0].id);
      } catch (err) {
        console.error("Error loading branches:", err);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  // Load monthly data when branch or month changes
  useEffect(() => {
    if (!branch) return; // wait until branch is selected
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchBranchMonthlyData(branch, month);
        setMonthlyData(data);
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
