import { Search, UserPlus } from "lucide-react";
import React from "react";

export default function EmployeeFilters({
  search,
  setSearch,
  filterBranch,
  setFilterBranch,
  filterRole,
  setFilterRole,
  setCurrent,
  setIsAddMode,
  setShowDialog,
  branches,
  roleCatalog,
  coffee,
}) {

  const openAdd = () => {
    setCurrent({
      id: Date.now(),
      name: "",
      email: "",
      password: "",
      branchId: branches[0]?.id || null,
      roles: [],
      hireDate: new Date().toISOString().slice(0, 10),
      created_by: "TEMP_USER_ID", 
    });
    setIsAddMode(true);
    setShowDialog(true);
  };

  return (
    <section
      className={`${coffee.panel} p-4 rounded-2xl shadow-md border ${coffee.border} mb-6`}
    >
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, branch..."
            className="w-full outline-none"
          />
        </div>

        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-white"
          title="Filter by branch"
        >
          <option value="All">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-white"
          title="Filter by role"
        >
          <option value="All">All Roles</option>
          {roleCatalog.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffd7a8] hover:bg-[#ffc98a] text-[#5c4033] font-semibold shadow"
        >
          <UserPlus size={18} /> Add Employee
        </button>
      </div>
    </section>
  );
}
