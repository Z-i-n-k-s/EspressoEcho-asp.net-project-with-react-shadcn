import branchApi from "@/api/Branch_api";
import { Edit, Plus, UserPlus } from "lucide-react";
import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      manager_id: currentManager ? currentManager.id : null, // allow null
    };

    if (editingId) {
      const updated = await branchApi.updateBranch(editingId, payload);
      setBranches(branches.map((b) => (b.id === editingId ? updated : b)));
      setEditingId(null);
    } else {
      console.log("Creating branch with payload:", payload);
      const created = await branchApi.createBranch(payload);

      setBranches([...branches, created]);
    }

    // Reset
    setFormData({
      name: "",
      address: "",
      contact_phone: "",
      manager_id: "",
      status: "open",
    });
    setCurrentManager(null);
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
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

        {/* Manager (optional) */}
        <div className="flex items-center gap-3">
          {currentManager ? (
            <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700">
              {currentManager.name}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowManagerDialog(true)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-100"
            >
              <UserPlus size={16} /> Add Manager (Optional)
            </button>
          )}
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

      <button
        type="submit"
        className="bg-[#6b4226] hover:bg-[#5c3620] text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {editingId ? <Edit size={16} /> : <Plus size={16} />}
        {editingId ? "Update Branch" : "Add Branch"}
      </button>

      {/* Manager Modal */}
      {showManagerDialog && (
        <ManagerDialog
          current={currentManager || {}}
          setCurrent={setCurrentManager}
          setShowDialog={setShowManagerDialog}
          branchName={formData.name}
          coffee={{
            panel: "bg-white",
            border: "border-gray-200",
            textDark: "text-gray-800",
          }}
          onSave={(newManager) => {
            setCurrentManager(newManager);
            setFormData({ ...formData, manager_id: newManager.id });
          }}
        />
      )}
    </form>
  );
}
