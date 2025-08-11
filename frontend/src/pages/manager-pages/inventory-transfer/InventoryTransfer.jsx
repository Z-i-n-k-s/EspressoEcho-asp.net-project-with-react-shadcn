import { useState, useEffect } from "react";
import {
  Package,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  History,
} from "lucide-react";

export default function ManagerInventoryDashboard() {
  const [formData, setFormData] = useState({
    fromBranch: "",
    toBranch: "",
    item: "",
    quantity: "",
    notes: "",
  });

  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);

  // Dashboard stats
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    lowStock: 0,
  });

  useEffect(() => {
    fetchPendingTransfers();
    fetchTransferHistory();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  const handleApprove = (id) => {
    // Approve logic
  };

  const handleReject = (id) => {
    // Reject logic
  };

  return (
  <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
   {/*  "space-y-6 font-[Inter] bg-gradient-to-b from-[#f8ede3] to-[#f3e5d0] min-h-screen p-6" */}
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        <ArrowLeftRight className="text-[#6b4226]" />  Inventory Transfer
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#fffaf5] p-4 rounded-xl shadow-lg border border-[#e7dcd3] flex items-center gap-3">
          <Clock className="text-[#6b4226]" />
          <div>
            <p className="text-sm text-[#5c4033]">Pending Transfers</p>
            <h3 className="text-xl font-bold">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-lg border border-green-200 flex items-center gap-3">
          <CheckCircle className="text-green-700" />
          <div>
            <p className="text-sm text-green-700">Completed</p>
            <h3 className="text-xl font-bold">{stats.completed}</h3>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-lg border border-red-200 flex items-center gap-3">
          <XCircle className="text-red-700" />
          <div>
            <p className="text-sm text-red-700">Rejected</p>
            <h3 className="text-xl font-bold">{stats.rejected}</h3>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-lg border border-yellow-200 flex items-center gap-3">
          <AlertTriangle className="text-yellow-700" />
          <div>
            <p className="text-sm text-yellow-700">Low Stock Alerts</p>
            <h3 className="text-xl font-bold">{stats.lowStock}</h3>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Transfer Form */}
        <div className="bg-[#fff8f1] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
          <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Package className="text-[#6b4226]" /> Create Transfer Request
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.fromBranch}
              onChange={(e) =>
                setFormData({ ...formData, fromBranch: e.target.value })
              }
            >
              <option value="">From Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.toBranch}
              onChange={(e) =>
                setFormData({ ...formData, toBranch: e.target.value })
              }
            >
              <option value="">To Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
            >
              <option value="">Select Item</option>
            </select>
            <input
              type="number"
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
            <textarea
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373] col-span-2"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-[#d4a373] hover:bg-[#b5835a] text-white font-semibold py-2 px-4 rounded-lg shadow-md col-span-2 transition"
            >
              Submit Transfer Request
            </button>
          </form>
        </div>

        {/* Pending Transfers */}
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
      </div>

      {/* Transfer History */}
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
    </div>
  );
}
