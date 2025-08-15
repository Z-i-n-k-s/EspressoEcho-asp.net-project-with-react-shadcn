import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Cards from "./Cards";
import TransferForm from "./TransferForm";
import PendingTransfer from "./PendingTransfer";
import TransferHistory from "./TransferHistory";

export default function ManagerInventoryDashboard() {
  const mockMode = true; // toggle this off when using real API{clean this line when call real api}

  // Dashboard stats
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const branchId = localStorage.getItem("branchId") || "defaultBranch"; // Get branch ID from localStorage or set a default
    fetchStats(); // fetchStats(branchId);
  }, []);

  const fetchStats = async (branchId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate API delay

      // Fallback mock data
      setStats({
        pending: 5,
        completed: 12,
        rejected: 3,
        approved: 8,
      });
      // const res = await fetch(`/api/inventory/stats?branchId=${branchId}`); // Replace with real API
      // if (!res.ok) throw new Error("Failed to fetch stats");

      // const data = await res.json();
      // setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        <ArrowLeftRight className="text-[#6b4226]" /> Inventory Transfer
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading data...
          </span>
        </div>
      ) : (
        <>
          {/* Dashboard Cards */}
          <Cards stats={stats} />

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Transfer Form */}
            <TransferForm />

            {/* Pending Transfers */}
            {/* <PendingTransfer setStats={setStats} /> */}
            <PendingTransfer setStats={mockMode ? () => {} : setStats} /> {/*clean this line when call real api */}
          </div>

          <TransferHistory setStats={mockMode ? () => {} : setStats} /> {/*clean this line when call real api */}

          {/* Transfer History */}
          {/* <TransferHistory setStats={setStats} /> */}
        </>
      )}
    </div>
  );
}
