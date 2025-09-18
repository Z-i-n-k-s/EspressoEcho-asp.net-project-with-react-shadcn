import branchApi from "@/api/Branch_api";
import employeeApi from "@/api/Employee_api";
import { Edit, Plus, UserPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import ManagerDialog from "./ManagerDialog";

export default function BranchForm({
  formData,
  setFormData,
  editingId,
  setBranches,
  setEditingId,
  branches,
}) {
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prefill form and manager when editing
  useEffect(() => {
    if (editingId) {
      const branch = branches.find((b) => b.id === editingId);
      if (!branch) return;

      // Prefill formData
      setFormData({
        name: branch.name || "",
        address: branch.address || "",
        contact_phone: branch.contact_phone || "",
        status: branch.status || "open",
        manager_id: branch.manager?.user_id || null,
      });

      // Prefill currentManager for UI
      if (branch.manager) {
        setCurrentManager({
          employeeId: branch.manager.id,
          userId: branch.manager.user_id,
          fullName: branch.manager.full_name,
          email: branch.manager.email,
        });
      } else {
        setCurrentManager(null);
      }
    }
  }, [editingId, branches, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedBranch;

      // Prepare payload: use currentManager if changed, else keep existing
      const payload = {
        ...formData,
        manager_id: currentManager?.userId ?? formData.manager_id ?? undefined,
      };

      if (editingId) {
        // Update existing branch
        savedBranch = await branchApi.updateBranch(editingId, payload);
        setBranches(
          branches.map((b) => (b.id === editingId ? savedBranch : b))
        );
        setEditingId(null);
        setFormData({
          name: "",
          address: "",
          contact_phone: "",
          status: "open",
          manager_id: "",
        });
        setCurrentManager(null);
      } else {
        // Create new branch
        savedBranch = await branchApi.createBranch(payload);
        setBranches([...branches, savedBranch]);

        // Update employee's branch if manager added
        if (currentManager) {
          await employeeApi.updateEmployee(currentManager.employeeId, {
            branch_id: savedBranch.id,
          });
        }
      }

      // Reset form only after creating new branch
      if (!editingId) {
        setFormData({
          name: "",
          address: "",
          contact_phone: "",
          status: "open",
          manager_id: "",
        });
        setCurrentManager(null);
      }
    } catch (err) {
      console.error("Failed to save branch:", err);
      alert("Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#fff8f1] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Branch Name */}
        <input
          type="text"
          placeholder="Branch Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="p-2 border rounded-lg"
        />

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
          className="p-2 border rounded-lg"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Contact Phone"
          value={formData.contact_phone}
          onChange={(e) =>
            setFormData({ ...formData, contact_phone: e.target.value })
          }
          required
          className="p-2 border rounded-lg"
        />

        {/* Manager */}
        <div className="flex items-center gap-3">
          {currentManager && (
            <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700">
              Manager: {currentManager.fullName}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowManagerDialog(true)}
            disabled={!formData.name.trim()} // disable if branch name is empty
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-white 
      ${
        formData.name.trim()
          ? "bg-[#6b4226] hover:bg-[#5c3620]"
          : "bg-gray-300 cursor-not-allowed"
      }`}
          >
            <UserPlus size={16} />{" "}
            {currentManager ? "Change Manager" : "Add Manager"} (Optional)
          </button>
        </div>

        {/* Status */}
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="p-2 border rounded-lg"
          required
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="temporarily_closed">Temporarily Closed</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#6b4226] hover:bg-[#5c3620] text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Saving...
          </>
        ) : editingId ? (
          <>
            <Edit size={16} />
            Update Branch
          </>
        ) : (
          <>
            <Plus size={16} />
            Add Branch
          </>
        )}
      </button>

      {/* Manager Modal */}
      {showManagerDialog && (
        <ManagerDialog
          initial={currentManager}
          setShowDialog={setShowManagerDialog}
          branchName={formData.name}
          coffee={{
            panel: "bg-white",
            border: "border-gray-200",
            textDark: "text-gray-800",
          }}
          onSave={(newManager) => {
            setCurrentManager(newManager);
            setFormData({ ...formData, manager_id: newManager.userId });
          }}
        />
      )}
    </form>
  );
}
