import { Building2, Edit3, Shield, Trash2 } from "lucide-react";
import React, { useMemo } from "react";

export default function EmployeeTable({
  employees,
  search,
  filterBranch,
  filterStatus,
  filterRole,
  loading,
  branchName,
  roleCatalog,
  coffee,
  setCurrent,
  setIsAddMode,
  setShowDialog,
  setEmployees
}) {

const roleLabel = (id) => roleCatalog.find((r) => r.id === id)?.label || id;

    const remove = (id) => {
    if (!confirm("Delete this employee?")) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };


  const openEdit = (emp) => {
    setCurrent({ ...emp });
    setIsAddMode(false);
    setShowDialog(true);
  };


  const filtered = useMemo(() => {
      return employees.filter((e) => {
        const q = search.trim().toLowerCase();
        const matchesText =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          branchName(e.branchId).toLowerCase().includes(q);
  
        const matchesBranch =
          filterBranch === "All" || e.branchId === Number(filterBranch);
  
        const matchesStatus =
          filterStatus === "All" || e.status === filterStatus;
  
        const matchesRole =
          filterRole === "All" || e.roles.includes(filterRole);
  
        return matchesText && matchesBranch && matchesStatus && matchesRole;
      });
    }, [employees, search, filterBranch, filterStatus, filterRole]);

  return (
    <section
      className={`${coffee.panelAlt} p-6 rounded-2xl shadow-lg border ${coffee.border}`}
    >
      <h2
        className={`text-lg font-semibold ${coffee.textDark} mb-4 flex items-center gap-2`}
      >
        <Building2 className="text-[#6b4226]" /> Employees
      </h2>

      {loading ? (
        <p className="italic text-center text-[#5c4033]">
          Loading employees...
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b4226] text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Status</th>
                <th className="p-3">Hired</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-[#5c4033] italic"
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                filtered.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`border-b ${
                      idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-medium flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#f0e4d6] flex items-center justify-center text-sm font-bold text-[#5c4033]">
                        {e.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-[#5c4033] font-semibold">
                          {e.name}
                        </div>
                        <div className="text-xs text-gray-500">{e.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{e.phone}</div>
                    </td>
                    <td className="p-3">{branchName(e.branchId)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {e.roles.length === 0 ? (
                          <span className="text-xs text-gray-500">
                            No roles
                          </span>
                        ) : (
                          e.roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-1 rounded-full text-xs ${coffee.chip} border ${coffee.border} flex items-center gap-1`}
                            >
                              <Shield size={12} /> {roleLabel(r)}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          e.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : e.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3">{e.hireDate}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(e)}
                          className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => remove(e.id)}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
