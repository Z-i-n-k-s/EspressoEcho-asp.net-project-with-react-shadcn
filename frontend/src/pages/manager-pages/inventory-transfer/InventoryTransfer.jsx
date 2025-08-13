import { useState } from "react";
import {ArrowLeftRight} from "lucide-react";
import Cards from "./Cards";
import TransferForm from "./TransferForm";
import PendingTransfer from "./PendingTransfer";
import TransferHistory from "./TransferHistory";

export default function ManagerInventoryDashboard() {
  // Dashboard stats
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    lowStock: 0,
  });
  return (
  <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
   {/*  "space-y-6 font-[Inter] bg-gradient-to-b from-[#f8ede3] to-[#f3e5d0] min-h-screen p-6" */}
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        <ArrowLeftRight className="text-[#6b4226]" />  Inventory Transfer
      </h1>

      {/* Dashboard Cards */}
      <Cards stats={stats} />

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Transfer Form */}
        <TransferForm/>

        {/* Pending Transfers */}
        <PendingTransfer setStats={setStats}
        />
      </div>

      {/* Transfer History */}
      <TransferHistory setStats={setStats} />
    </div>
  );
}
