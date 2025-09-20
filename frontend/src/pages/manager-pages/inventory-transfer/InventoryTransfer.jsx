import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Cards from "./Cards";
import TransferForm from "./TransferForm";
import PendingTransfer from "./PendingTransfer";
import TransferHistory from "./TransferHistory";
import inventoryTransferApi from "@/api/Inventory_transfer_api";


export default function ManagerInventoryDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await inventoryTransferApi.listTransfers();
      const transfers = res.data.data; 
      setStats({
        pending: transfers.filter(t => t.status === "pending").length,
        completed: transfers.filter(t => t.status === "completed").length,
        rejected: transfers.filter(t => t.status === "rejected").length,
        approved: transfers.filter(t => t.status === "approved").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
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
          <Cards stats={stats} />

          <div className="grid grid-cols-2 gap-6">
            <TransferForm />
            <PendingTransfer setStats={setStats} />
          </div>

          <TransferHistory setStats={setStats} />
        </>
      )}
    </div>
  );
}
