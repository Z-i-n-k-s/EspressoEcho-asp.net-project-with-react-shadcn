import { History } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function TransferHistory({ setStats }) {
    const [transferHistory, setTransferHistory] = useState([]);

  useEffect(() => {
    fetchTransferHistory();
  }, []);

 

  const fetchTransferHistory = async () => {
    // Fake data for now
    const data = [
      {
        id: 101,
        fromBranch: "Branch 2",
        toBranch: "Branch 1",
        item: "Monitor",
        quantity: 3,
        status: "Completed",
        date: "2025-08-05",
      },
      {
        id: 102,
        fromBranch: "Branch 1",
        toBranch: "Branch 2",
        item: "Keyboard",
        quantity: 10,
        status: "Rejected",
        date: "2025-08-06",
      },
    ];
    setTransferHistory(data);
    setStats((prev) => ({
      ...prev,
      completed: data.filter((t) => t.status === "Completed").length,
      rejected: data.filter((t) => t.status === "Rejected").length,
    }));
  };

  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
          <History className="text-[#6b4226]" /> Transfer History
        </h2>
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#6b4226] text-white">
              {/* "bg-[#f4e3d3] text-[#5c4033]" */}
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Item</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-[#5c4033] italic"
                  >
                    No transfer history
                  </td>
                </tr>
              ) : (
                transferHistory.map((t,idx) => (
                  <tr
                    key={t.id}
                    className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                  idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                }`}
                    // className="hover:bg-[#f8efe6] transition border-b border-[#e7dcd3]"
                  >
                    <td className="p-3 text-center">{t.fromBranch}</td>
                    <td className="p-3 text-center">{t.toBranch}</td>
                    <td className="p-3 text-center">{t.item}</td>
                    <td className="p-3 text-center">{t.quantity}</td>
                    <td
                      className={`p-3 font-semibold text-center ${
                        t.status === "Completed"
                          ? "text-green-700"
                          : t.status === "Rejected"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="p-3 text-center">{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
  )
}
