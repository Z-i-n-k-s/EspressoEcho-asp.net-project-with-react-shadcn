import { CheckCircle, Clock, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function PendingTransfer({setStats}) {
useEffect(() => {
    fetchPendingTransfers();
  }, []);

  const [pendingTransfers, setPendingTransfers] = useState([]);
   const fetchPendingTransfers = async () => {
    // Fake data for now
    const data = [
      {
        id: 1,
        fromBranch: "Branch 1",
        toBranch: "Branch 2",
        item: "Laptop",
        quantity: 5,
        requestedBy: "John",
      },
    ];
    setPendingTransfers(data);
    setStats((prev) => ({ ...prev, pending: data.length }));
  };
  
   const handleApprove = () => {
    // Approve logic
  };

  const handleReject = () => {
    // Reject logic
  };
  return (
    <div className="bg-[#fff8f0] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
          <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Clock className="text-[#6b4226]" /> Pending Transfers
          </h2>
          {pendingTransfers.length === 0 ? (
            <p className="text-center italic text-[#5c4033]">
              No pending transfers
            </p>
          ) : (
            <ul className="space-y-3">
              {pendingTransfers.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow border border-[#e7dcd3]"
                >
                  <div>
                    <p className="font-semibold">
                      {t.item} ({t.quantity})
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.fromBranch} → {t.toBranch}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(t.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(t.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
  )
}
