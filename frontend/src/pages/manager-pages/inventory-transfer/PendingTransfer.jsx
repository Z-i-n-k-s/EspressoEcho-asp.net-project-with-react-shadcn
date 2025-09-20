import React, { useEffect, useState } from "react";
import employeeApi from "@/api/Employee_api";
import inventoryTransferApi from "@/api/Inventory_transfer_api";
import { CheckCircle, Clock, XCircle, Check } from "lucide-react";
import { useSelector } from "react-redux";



export default function PendingTransfer({ setStats }) {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [managerBranch, setManagerBranch] = useState(null);
  const [loading, setLoading] = useState(true);
   const user = useSelector((state) => state.user.user);

  const tempManagerId = user.id;
  const employeeId = user.employee.id;

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const emp = await employeeApi.getEmployeeById(employeeId);
        if (!emp?.branch_id) {
          console.warn("No branch_id found for employee");
          setLoading(false);
          return;
        }
        setManagerBranch(emp.branch_id);

        const response = await inventoryTransferApi.listTransfers();
        const allTransfers = response.data?.data || [];

        // Only show pending or approved transfers for this branch not created by this employee
        const incoming = allTransfers.filter((t) => {
          if (t.status === "pending") {
            // show for from branch manager
            return (
              t.from_branch_id === emp.branch_id &&
              t.requested_by !== employeeId
            );
          }
          if (t.status === "approved") {
            // show for to branch manager
            return t.to_branch_id === emp.branch_id;
          }
          return false;
        });

        setPendingTransfers(incoming);
        setStats((prev) => ({
          ...prev,
          pending: incoming.filter((t) => t.status === "pending").length,
        }));
      } catch (err) {
        console.error("Error fetching pending transfers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [setStats]);

  const handleApprove = async (id) => {
    try {
      await inventoryTransferApi.approveTransfer(id, tempManagerId);
      setPendingTransfers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
      );
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
      alert("Transfer approved successfully!");
    } catch (err) {
      console.error("Error approving transfer:", err);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return; // cancel if empty

    try {
      await inventoryTransferApi.rejectTransfer(id, tempManagerId, reason);
      setPendingTransfers((prev) => prev.filter((t) => t.id !== id));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
      alert("Transfer rejected successfully!");
    } catch (err) {
      console.error("Error rejecting transfer:", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await inventoryTransferApi.completeTransfer(id, tempManagerId);
      setPendingTransfers((prev) => prev.filter((t) => t.id !== id));
      setStats((prev) => ({
        ...prev,
        approved: prev.approved - 1,
        completed: (prev.completed || 0) + 1,
      }));
      alert("Transfer approved successfully!");
    } catch (err) {
      console.error("Error completing transfer:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fff8f0] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] text-center text-[#5c4033]">
        Loading pending transfers...
      </div>
    );
  }

  return (
    <div className="bg-[#fff8f0] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <Clock className="text-[#6b4226]" /> Incoming Pending Transfers
      </h2>

      {pendingTransfers.length === 0 ? (
        <p className="text-center italic text-[#5c4033]">
          No pending incoming transfers
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
                  {t.reason || "No reason provided"}
                </p>
                <p className="text-sm text-gray-600">
                  To: {t.to_branch_name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  Requested by: {t.requester_name || "Unknown"}
                </p>
                <p
                  className={`text-xs font-bold ${
                    t.status === "approved"
                      ? "text-green-600"
                      : t.status === "rejected"
                      ? "text-red-600"
                      : "text-gray-500 font-normal"
                  }`}
                >
                  Status: {t.status}
                </p>
              </div>
              <div className="flex gap-2">
                {t.status === "pending" &&
                  t.from_branch_id === managerBranch && (
                    <>
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
                    </>
                  )}
                {t.status === "approved" &&
                  t.to_branch_id === managerBranch && (
                    <button
                      onClick={() => handleComplete(t.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Check size={16} /> Complete
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
