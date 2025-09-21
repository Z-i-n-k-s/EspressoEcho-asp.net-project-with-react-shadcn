import inventoryTransferApi from "@/api/Inventory_transfer_api";
import { History } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function TransferHistory({ setStats }) {
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const employeeId = user?.employee?.id;

  useEffect(() => {
    fetchTransferHistory();
  }, []);

  const fetchTransferHistory = async () => {
    setLoading(true);
    try {
      const res = await inventoryTransferApi.listTransfers();
      const transfers = res.data.data;

      const transfersWithItems = await Promise.all(
        transfers.map(async (t) => {
          try {
            const detailsRes = await inventoryTransferApi.getTransfer(t.id);
            return { ...t, items: detailsRes.data.items || [] };
          } catch {
            return { ...t, items: [] };
          }
        })
      );

      setTransferHistory(transfersWithItems);
      updateStatsFromHistory(transfersWithItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    if (transfer.approved_by === employeeId) return "approved"; // you approved
    if (transfer.requested_by === employeeId && transfer.status === "pending")
      return "pending"; // you requested
    if (transfer.requested_by === employeeId && transfer.status === "rejected")
      return "rejected"; // you requested rejected
    if (transfer.received_by === employeeId) return "completed"; // you received
    return transfer.status; // fallback for others
  };

  const updateStatsFromHistory = (transfers) => {
    setStats({
      completed: transfers.filter((t) => getRoleBasedStatus(t) === "completed")
        .length,
      rejected: transfers.filter((t) => getRoleBasedStatus(t) === "rejected")
        .length,
      approved: transfers.filter((t) => getRoleBasedStatus(t) === "approved")
        .length,
      pending: transfers.filter((t) => getRoleBasedStatus(t) === "pending")
        .length,
    });
  };

  if (loading) return <p>Loading transfer history...</p>;

  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <History className="text-[#6b4226]" /> Transfer History
      </h2>
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#6b4226] text-white">
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Item(s)</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {transferHistory.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-[#5c4033] italic"
                >
                  No transfer history
                </td>
              </tr>
            ) : (
              transferHistory.map((t, idx) => {
                const roleStatus = getRoleBasedStatus(t);
                return (
                  <tr
                    key={t.id}
                    className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                      idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                    }`}
                  >
                    <td className="p-3 text-center">{t.from_branch_name}</td>
                    <td className="p-3 text-center">{t.to_branch_name}</td>
                    <td className="p-3 text-center">
                      {t.items.map((i) => i.product_name).join(", ")}
                    </td>
                    <td className="p-3 text-center">
                      {t.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td
                      className={`p-3 font-semibold text-center ${
                        roleStatus === "completed"
                          ? "text-green-700"
                          : roleStatus === "rejected"
                          ? "text-red-700"
                          : roleStatus === "approved"
                          ? "text-blue-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {roleStatus}
                    </td>
                    <td className="p-3 text-center">
                      {t.requested_at?.split(" ")[0]}
                    </td>
                    <td className="p-3 text-center">
                      {roleStatus === "rejected"
                        ? t.rejection_reason || "No reason provided"
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
