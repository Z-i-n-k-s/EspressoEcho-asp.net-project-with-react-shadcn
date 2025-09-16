import { UserPlus, XCircle } from "lucide-react";
import React from "react";

export default function ManagerDialog({
  current,
  setCurrent,
  setShowDialog,
  onSave,
  branchName,
  coffee,
}) {
  const save = () => {
    if (!current.name?.trim()) return alert("Name is required");
    if (!current.email?.trim()) return alert("Email is required");

    // Force role to Manager
    const newManager = {
      ...current,
      id: Date.now(), // in real backend, this will come from API
      roles: ["Manager"],
      branchName,
    };

    onSave(newManager);
    setShowDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/bg3.jpg')] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative ${coffee.panel} p-6 rounded-2xl shadow-2xl w-[520px] max-w-[92vw] border ${coffee.border}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${coffee.textDark} flex items-center gap-2`}>
            <UserPlus /> Add Manager for {branchName || "Branch"}
          </h3>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => setShowDialog(false)}
          >
            <XCircle className="text-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Full Name
            </label>
            <input
              value={current?.name || ""}
              onChange={(e) => setCurrent({ ...current, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Ayesha Rahman"
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Email
            </label>
            <input
              type="email"
              value={current?.email || ""}
              onChange={(e) => setCurrent({ ...current, email: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="name@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Phone
            </label>
            <input
              value={current?.phone || ""}
              onChange={(e) => setCurrent({ ...current, phone: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="+8801XXXXXXXXX"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300"
          >
            Save Manager
          </button>
        </div>
      </div>
    </div>
  );
}
