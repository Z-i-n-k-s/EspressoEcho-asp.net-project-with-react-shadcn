import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import EmployeeDialog from "./EmployeeDialog";
import EmployeeTable from "./EmployeeTable";
import EmployeeFilters from "./EmployeeFilters";
import branchApi from "@/api/Branch_api";
import employeeApi from "@/api/Employee_api";

// Coffee palette
const coffee = {
  bg: "bg-gradient-to-b from-[#f5e6d3] to-[#6b4226]",
  panel: "bg-[#fff8f1]",
  panelAlt: "bg-[#d0b8a8]",
  textDark: "text-[#5c4033]",
  border: "border-[#e7dcd3]",
  primary: "bg-[#6b4226] text-white",
  chip: "bg-[#f0e4d6] text-[#5c4033]",
};

export default function EmployeeManagement() {
  const [branches, setBranches] = useState([]);
  const [roleCatalog] = useState([
    { id: "cashier", label: "Cashier" },
    { id: "manager", label: "Manager" },
    { id: "staff", label: "Staff" },
  ]);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [current, setCurrent] = useState(null);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    fetchBranches();
    fetchEmployees();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await branchApi.getAllBranches();
      setBranches(res.data || []);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  };

  const fetchEmployees = async () => {
  setLoading(true);
  try {
    const res = await employeeApi.getAllEmployees();

    // Use res directly if it's an array
    const employeesArray = Array.isArray(res.data) ? res.data : res;

    const mapped = employeesArray.map((e) => ({
      id: e.id,
      name: e.user?.full_name || "-",
      email: e.user?.email || "-",
      branchId: e.branch_id || null,
      branchName: e.branch?.name || "-",
      hireDate: e.hire_date?.split("T")[0] || "-",
      roles: [e.role],
      created_by: e.created_by,
    }));

    setEmployees(mapped);
  } catch (err) {
    console.error("Failed to fetch employees:", err);
  } finally {
    setLoading(false);
  }
};


  const branchName = (id) => branches.find((b) => b.id === id)?.name || "-";

  return (
    <div className={`min-h-screen ${coffee.bg} p-6 font-[Inter]`}>
      <header className="mb-6 flex items-center gap-3">
        <Users className="text-[#5c4033] drop-shadow" />
        <h1 className="text-3xl font-extrabold text-[#5c4033]">
          Employee Management
        </h1>
      </header>

      <EmployeeFilters
        search={search}
        setSearch={setSearch}
        filterBranch={filterBranch}
        setFilterBranch={setFilterBranch}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        setCurrent={setCurrent}
        setIsAddMode={setIsAddMode}
        setShowDialog={setShowDialog}
        branches={branches}
        roleCatalog={roleCatalog}
        coffee={coffee}
      />

      <EmployeeTable
        employees={employees}
        search={search}
        filterBranch={filterBranch}
        filterRole={filterRole}
        loading={loading}
        branchName={branchName}
        roleCatalog={roleCatalog}
        coffee={coffee}
        setCurrent={setCurrent}
        setShowDialog={setShowDialog}
        setIsAddMode={setIsAddMode}
        setEmployees={setEmployees}
      />

      {showDialog && (
        <EmployeeDialog
          current={current}
          setCurrent={setCurrent}
          isAddMode={isAddMode}
          setShowDialog={setShowDialog}
          coffee={coffee}
          branches={branches}
          roleCatalog={roleCatalog}
          setEmployees={setEmployees}
        />
      )}
    </div>
  );
}
