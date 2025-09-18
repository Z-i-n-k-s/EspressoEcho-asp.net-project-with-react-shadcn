import employeeApi from "@/api/Employee_api";
import { UserPlus, XCircle } from "lucide-react";
import React, { useState } from "react";

export default function ManagerDialog({
  initial,
  setShowDialog,
  onSave,
  branchId, // receive branch id from parent (BranchForm)
  branchName,
  coffee,
}) {
  const [draft, setDraft] = useState({
    full_name: initial?.fullName || "",
    email: initial?.email || "",
    password: "",
    hire_date: "",
  });

  const [loading, setLoading] = useState(false); 

  const save = async () => {
    if (!draft.full_name?.trim()) return alert("Full name is required");
    if (!draft.email?.trim()) return alert("Email is required");
    if (!draft.password?.trim()) return alert("Password is required");
    if (!draft.hire_date) return alert("Hire date is required");

    setLoading(true); 
    try {
      const payload = {
        email: draft.email,
        password: draft.password,
        full_name: draft.full_name,
        branch_id: branchId || null,
        role: "manager",
        hire_date: draft.hire_date,
        created_by: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // temp until auth
      };

      const newManager = await employeeApi.createEmployee(payload);
      console.log("Saved manager:", newManager);

      // Normalize manager for parent
      onSave({
        employeeId: newManager.id,
        userId: newManager.user_id,
        fullName: newManager.user?.full_name || newManager.full_name,
        email: newManager.user?.email || newManager.email,
      });

      setShowDialog(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save manager");
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/bg3.jpg')] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative ${coffee.panel} p-6 rounded-2xl shadow-2xl w-[520px] max-w-[92vw] border ${coffee.border}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-2xl font-bold ${coffee.textDark} flex items-center gap-2`}
          >
            <UserPlus /> Add Manager for {branchName || "Branch"}
          </h3>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => setShowDialog(false)}
          >
            <XCircle className="text-red-500" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Full Name
            </label>
            <input
              value={draft.full_name}
              onChange={(e) =>
                setDraft({ ...draft, full_name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Ayesha Rahman"
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Email
            </label>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Password
            </label>
            <input
              type="password"
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="******"
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Hire Date
            </label>
            <input
              type="date"
              value={draft.hire_date}
              onChange={(e) =>
                setDraft({ ...draft, hire_date: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-800"></div>
                Saving...
              </>
            ) : (
              "Save Manager"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
