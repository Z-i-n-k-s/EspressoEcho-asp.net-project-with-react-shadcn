import branchApi from "@/api/Branch_api";
import employeeApi from "@/api/Employee_api";
import { UserCog, UserPlus, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EmployeeDialog({
  current,
  setCurrent,
  isAddMode,
  setShowDialog,
  coffee,
  roleCatalog,
  setEmployees,
}) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);

  // Fetch branches once
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchApi.getAllBranches();
        setBranches(res.data || []);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      }
    };
    fetchBranches();
  }, []);

  // Toggle role selection
  const toggleRole = (roleId) => {
    setCurrent((c) => {
      const has = c.roles.includes(roleId);
      return {
        ...c,
        roles: has ? c.roles.filter((r) => r !== roleId) : [...c.roles, roleId],
      };
    });
  };

  // Normalize employee data for table
  const normalizeEmployee = (emp) => ({
    id: emp.id,
    name: emp.user?.full_name || emp.full_name || "",
    email: emp.user?.email || emp.email || "",
    branchName: emp.branch?.name || "-",
    roles: emp.roles || (emp.role ? [emp.role] : []),
    branchId: emp.branch_id,
    hireDate: emp.hire_date?.slice(0, 10) || "",
    created_by: emp.created_by,
  });

  // Save employee
  const save = async () => {
    if (!current.name?.trim()) return alert("Full name is required");
    if (!current.email?.trim()) return alert("Email is required");
    if (isAddMode && !current.password?.trim()) return alert("Password is required");
    if (!current.roles?.length) return alert("Select at least one role");
    if (!current.branchId) return alert("Select a branch");

    const payload = {
      full_name: current.name,
      email: current.email,
      password: isAddMode ? current.password : undefined,
      branch_id: current.branchId,
      role: current.roles[0],
      hire_date: current.hireDate,
      created_by: user.id,
    };

    setLoading(true);

    try {
      let apiResponse;
      if (isAddMode) {
        apiResponse = await employeeApi.createEmployee(payload);
      } else {
        apiResponse = await employeeApi.updateEmployee(current.id, payload);
      }

      // Normalize API response
      const savedEmployee = normalizeEmployee(apiResponse);

      // Update parent state
      setEmployees((prev) =>
        isAddMode
          ? [...prev, savedEmployee]
          : prev.map((p) => (p.id === current.id ? savedEmployee : p))
      );

      setShowDialog(false);
      window.location.reload();
    } catch (err) {
      console.error("Error saving employee:", err, err.response?.data);
      alert("Failed to save employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/bg3.jpg')] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative ${coffee.panel} p-6 rounded-2xl shadow-2xl w-[720px] max-w-[92vw] border ${coffee.border} max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${coffee.textDark} flex items-center gap-2`}>
            {isAddMode ? <><UserPlus /> Add Employee</> : <><UserCog /> Edit Employee</>}
          </h3>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => setShowDialog(false)}
          >
            <XCircle className="text-red-500" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-2">
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>Full Name</label>
            <input
              value={current?.name || ""}
              onChange={(e) => setCurrent({ ...current, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Ayesha Rahman"
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>Email</label>
            <input
              type="email"
              value={current?.email || ""}
              onChange={(e) => setCurrent({ ...current, email: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}
          {isAddMode && (
            <div>
              <label className={`block mb-1 font-semibold ${coffee.textDark}`}>Password</label>
              <input
                type="password"
                value={current?.password || ""}
                onChange={(e) => setCurrent({ ...current, password: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter password"
              />
            </div>
          )}

          {/* Branch */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>Branch</label>
            <select
              value={current?.branchId || branches[0]?.id || ""}
              onChange={(e) => setCurrent({ ...current, branchId: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hire Date */}
          <div>
            <label className={`block mb-1 font-semibold ${coffee.textDark}`}>Hire Date</label>
            <input
              type="date"
              value={current?.hireDate || new Date().toISOString().slice(0, 10)}
              onChange={(e) => setCurrent({ ...current, hireDate: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Roles */}
          <div className="col-span-2">
            <label className={`block mb-2 font-semibold ${coffee.textDark}`}>Assign Role</label>
            <div className="flex flex-wrap gap-2">
              {roleCatalog.map((r) => {
                const active = current?.roles?.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    className={`px-3 py-2 rounded-xl border ${coffee.border} flex items-center gap-2 text-sm ${
                      active
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5c4033] hover:bg-[#f7efe5]"
                    }`}
                    title={`Toggle ${r.label}`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 flex items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
