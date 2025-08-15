import React, { useEffect,  useState } from "react";
import  {Users }from "lucide-react";
import EmployeeDialog from "./EmployeeDialog";
import EmployeeTable from "./EmployeeTable";
import AttendancePanel from "./AttendancePanel";
import EmployeeFilters from "./EmployeeFilters";

// Coffee palette helpers
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
  // master data
  const [branches] = useState([
    { id: 1, name: "Central Coffee Hub" },
    { id: 2, name: "Riverside Roast" },
    { id: 3, name: "Uptown Beans" },
  ]);

  const [roleCatalog] = useState([
    { id: "cashier", label: "Cashier" },
    { id: "manager", label: "Manager" },
    { id: "staff", label: "Staff" },
  ]);

  // employees
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // ui state
  const [showDialog, setShowDialog] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [current, setCurrent] = useState(null);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");

  // optional: attendance & leave center panel
  const [showAttendancePanel, setShowAttendancePanel] = useState(false);

  useEffect(() => {
    seedEmployees();
  }, []);
  
  const seedEmployees = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));//simulate api delay show loading

      const mock = [
        {
          id: 1,
          name: "Ayesha Rahman",
          email: "ayesha@coffeehub.com",
          phone: "+880170000001",
          branchId: 1,
          roles: ["staff"],
          status: "Active",
          hireDate: "2024-11-15",
        },
        {
          id: 2,
          name: "Jahid Hasan",
          email: "jahid@coffeehub.com",
          phone: "+880170000002",
          branchId: 2,
          roles: ["cashier", "staff"],
          status: "Active",
          hireDate: "2023-06-03",
        },
        {
          id: 3,
          name: "Mina Akter",
          email: "mina@coffeehub.com",
          phone: "+880170000003",
          branchId: 1,
          roles: ["staff"],
          status: "On Leave",
          hireDate: "2022-02-01",
        },
        {
          id: 4,
          name: "Sabbir Hossain",
          email: "sabbir@coffeehub.com",
          phone: "+880170000004",
          branchId: 3,
          roles: ["manager"],
          status: "Inactive",
          hireDate: "2021-08-22",
        },
      ];
      setEmployees(mock);
    } finally {
      setLoading(false);
    }
  };

  const branchName = (id) => branches.find((b) => b.id === id)?.name || "-";
  
  // attendance mock data (optional extension)
  const [attendance, setAttendance] = useState([
    { id: 101, employeeId: 1, date: "2025-08-13", status: "Present" },
    { id: 102, employeeId: 2, date: "2025-08-13", status: "Present" },
    { id: 103, employeeId: 3, date: "2025-08-13", status: "On Leave" },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 201, employeeId: 2, from: "2025-08-18", to: "2025-08-19", reason: "Family event", status: "Pending" },
    { id: 202, employeeId: 1, from: "2025-08-21", to: "2025-08-22", reason: "Medical", status: "Pending" },
  ]);


  return (
    <div className={`min-h-screen ${coffee.bg} p-6 font-[Inter]`}>
      <header className="mb-6 flex items-center gap-3">
        <Users className="text-[#5c4033] drop-shadow" />
        <h1 className="text-3xl font-extrabold text-[#5c4033]">Employee Management</h1>
      </header>

      {/* Controls = handles all filters */}
      <EmployeeFilters
        search={search}
        setSearch={setSearch}
        filterBranch={filterBranch}
        setFilterBranch={setFilterBranch}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setCurrent={setCurrent}
        setIsAddMode={setIsAddMode}
        setShowDialog={setShowDialog}
        showAttendancePanel={showAttendancePanel}
        setShowAttendancePanel={setShowAttendancePanel}
        branches={branches}
        roleCatalog={roleCatalog}
        coffee={coffee}
      />

      {/* Attendance & Leave (Optional Extension) */}
      {showAttendancePanel && (
        <AttendancePanel
          attendance={attendance}
          employees={employees}
          branchName={branchName}
          leaveRequests={leaveRequests}
          coffee={coffee}
          setLeaveRequests={setLeaveRequests}
        />
      )}

      {/* Employees Table */}
      <EmployeeTable
        employees={employees}
        search={search}
        filterBranch={filterBranch}
        filterStatus={filterStatus}
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

      {/* Dialog */}
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
