import React, { useMemo } from "react";
import { Building2, Edit3, Shield, Trash2 } from "lucide-react";
import employeeApi from "@/api/Employee_api";
import { useSelector } from "react-redux";

export default function EmployeeTable({
  employees,
  search,
  filterBranch,
  filterRole,
  loading,
  roleCatalog,
  coffee,
  setCurrent,
  setIsAddMode,
  setShowDialog,
  setEmployees,
}) {
  const roleLabel = (id) => roleCatalog.find((r) => r.id === id)?.label || id;
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
const ADMIN_ID = user.id;

  const remove =async(id) => {
    if (!confirm("Delete this employee?")) return;
     try {
      await employeeApi.deleteEmployee(id, ADMIN_ID);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete employee:", err);
      alert("Failed to delete employee. Please try again.");
    }
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
        e.branchName.toLowerCase().includes(q);

      const matchesBranch =
        filterBranch === "All" || e.branchId === filterBranch;

      const matchesRole =
        filterRole === "All" || e.roles.includes(filterRole);

      return matchesText && matchesBranch && matchesRole;
    });
  }, [employees, search, filterBranch, filterRole]);

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
        <p className="italic text-center text-[#5c4033]">Loading employees...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b4226] text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Role</th>
                <th className="p-3">Hired</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-[#5c4033] italic">
                    No employees found
                  </td>
                </tr>
              ) : (
                filtered.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`border-b ${idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"}`}
                  >
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3">{e.email}</td>
                    <td className="p-3">{e.branchName}</td>
                    <td className="p-3">
                      {e.roles.map((r) => (
                        <span
                          key={r}
                          className={`px-2 py-1 rounded-full text-xs ${coffee.chip} border ${coffee.border} flex items-center gap-1`}
                        >
                          <Shield size={12} /> {roleLabel(r)}
                        </span>
                      ))}
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
