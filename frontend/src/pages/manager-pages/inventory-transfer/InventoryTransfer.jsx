import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Cards from "./Cards";
import TransferForm from "./TransferForm";
import PendingTransfer from "./PendingTransfer";
import TransferHistory from "./TransferHistory";
import inventoryTransferApi from "@/api/Inventory_transfer_api";
import { useSelector } from "react-redux";

export default function ManagerInventoryDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const employeeId = user?.employee?.id;

  useEffect(() => {
    fetchStats();
  }, [employeeId]);

  // 🔹 Correct role-based status mapping
  const getRoleBasedStatus = (transfer) => {
    if (transfer.status === "rejected") {
    // anyone involved (requested_by or approved_by) can see "rejected"
    if (
      transfer.requested_by === employeeId ||
      transfer.approved_by === employeeId
    ) {
      return "rejected";
    }
  }
  if (transfer.approved_by === employeeId) return "approved";   // you approved
  if (transfer.requested_by === employeeId && transfer.status === "pending") return "pending"; // you requested
  if (transfer.requested_by === employeeId && transfer.status === "rejected") return "rejected"; // you requested rejected
  if (transfer.received_by === employeeId) return "completed"; // you received
  return transfer.status; // fallback for others
};


  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await inventoryTransferApi.listTransfers();
      const transfers = res.data.data;

      const myTransfers = transfers.filter(
        (t) =>
          t.requested_by === employeeId ||
          t.approved_by === employeeId ||
          t.received_by === employeeId
      );

      const statuses = myTransfers.map((t) => getRoleBasedStatus(t)).filter(Boolean);

      setStats({
        pending: statuses.filter((s) => s === "pending").length,
        completed: statuses.filter((s) => s === "completed").length,
        rejected: statuses.filter((s) => s === "rejected").length,
        approved: statuses.filter((s) => s === "approved").length,
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
          <span className="ml-3 text-[#6b4226] font-semibold">Loading data...</span>
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
