import inventoryTransferApi from "@/api/Inventory_transfer_api";
import { History } from "lucide-react";
import React, { useEffect, useState } from "react";


export default function TransferHistory({ setStats }) {
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransferHistory();
  }, []);

  const fetchTransferHistory = async () => {
    setLoading(true);
    try {
      // 1. Fetch paginated list
      const res = await inventoryTransferApi.listTransfers();
      const transfers = res.data.data; // array of transfers

      // 2. Fetch items for each transfer
      const transfersWithItems = await Promise.all(
        transfers.map(async (t) => {
          try {
            const detailsRes = await inventoryTransferApi.getTransfer(t.id);
            return { ...t, items: detailsRes.data.items || [] };
          } catch (err) {
            console.error(`Failed to fetch items for transfer ${t.id}`, err);
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

  const updateStatsFromHistory = (transfers) => {
    setStats({
      completed: transfers.filter(t => t.status === "completed").length,
      rejected: transfers.filter(t => t.status === "rejected").length,
      approved: transfers.filter(t => t.status === "approved").length,
      pending: transfers.filter(t => t.status === "pending").length,
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
            </tr>
          </thead>
          <tbody>
            {transferHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-[#5c4033] italic">
                  No transfer history
                </td>
              </tr>
            ) : (
              transferHistory.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                    idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                  }`}
                >
                  <td className="p-3 text-center">{t.from_branch_name}</td>
                  <td className="p-3 text-center">{t.to_branch_name}</td>
                  <td className="p-3 text-center">
                    {t.items.map(i => i.product_name).join(", ")}
                  </td>
                  <td className="p-3 text-center">
                    {t.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td
                    className={`p-3 font-semibold text-center ${
                      t.status === "completed"
                        ? "text-green-700"
                        : t.status === "rejected"
                        ? "text-red-700"
                        : t.status === "approved"
                        ? "text-blue-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </td>
                  <td className="p-3 text-center">{t.requested_at?.split(" ")[0]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
