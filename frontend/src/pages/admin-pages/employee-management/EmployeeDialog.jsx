import { BadgeCheck, Shield, UserCog, UserPlus, XCircle } from "lucide-react";
import React from "react";

export default function EmployeeDialog({
  current,
  setCurrent,
  isAddMode,
  setShowDialog,
  coffee,
  branches,
  roleCatalog,
  setEmployees
  
}) {


    // role toggle helper
      const toggleRole = (roleId) => {
        setCurrent((c) => {
          const has = c.roles.includes(roleId);
          return { ...c, roles: has ? c.roles.filter((r) => r !== roleId) : [...c.roles, roleId] };
        });
      };


      const save = () => {
          if (!current.name?.trim()) return alert("Name is required");
          if (!current.email?.trim()) return alert("Email is required");
      
          setEmployees((prev) => {
            if (isAddMode) return [...prev, current];
            return prev.map((p) => (p.id === current.id ? current : p));
          });
          setShowDialog(false);
        };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/bg3.jpg')] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative ${coffee.panel} p-6 rounded-2xl shadow-2xl w-[720px] max-w-[92vw] border ${coffee.border} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-2xl font-bold ${coffee.textDark} flex items-center gap-2`}
          >
            {isAddMode ? (
              <>
                <UserPlus /> Add Employee
              </>
            ) : (
              <>
                <UserCog /> Edit Employee
              </>
            )}
          </h3>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => setShowDialog(false)}
          >
            <XCircle className="text-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-2">
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
              onChange={(e) =>
                setCurrent({ ...current, email: e.target.value })
              }
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
              onChange={(e) =>
                setCurrent({ ...current, phone: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          {/* Branch */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Branch
            </label>
            <select
              value={current?.branchId || branches[0]?.id}
              onChange={(e) =>
                setCurrent({ ...current, branchId: Number(e.target.value) })
              }
              className="w-full p-2 border rounded-lg"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Status
            </label>
            <select
              value={current?.status || "Active"}
              onChange={(e) =>
                setCurrent({ ...current, status: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              {["Active", "On Leave", "Inactive"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Hire Date */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>
              Hire Date
            </label>
            <input
              type="date"
              value={current?.hireDate || new Date().toISOString().slice(0, 10)}
              onChange={(e) =>
                setCurrent({ ...current, hireDate: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Roles */}
          <div className="col-span-2">
            <label
              className={`block mb-2 font-semibold ${coffee.textDark} flex items-center gap-2`}
            >
              <BadgeCheck /> Assign Roles
            </label>
            <div className="flex flex-wrap gap-2">
              {roleCatalog.map((r) => {
                const active = current?.roles?.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    className={`px-3 py-2 rounded-xl border ${
                      coffee.border
                    } flex items-center gap-2 text-sm ${
                      active
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5c4033] hover:bg-[#f7efe5]"
                    }`}
                    title={`Toggle ${r.label}`}
                  >
                    <Shield size={16} /> {r.label}
                  </button>
                );
              })}
            </div>
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
