import { CalendarCheck, CalendarX } from "lucide-react";
import React, { useState } from "react";

export default function AttendancePanel({
  attendance,
  employees,
  branchName,
  leaveRequests,
  coffee,
  setLeaveRequests
}) {
  const [selectedDate, setSelectedDate] = useState("");

  const setLeaveStatus = (reqId, status) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status } : r))
    );
  };

  // Filter attendance by selected date
  const filteredAttendance = selectedDate
    ? attendance.filter((a) => a.date === selectedDate)
    : attendance;

  return (
    <section
      className={`${coffee.panelAlt} p-4 rounded-2xl shadow-lg border ${coffee.border} mb-6`}
    >
      {/* Date picker */}
      <div className="mb-4 flex items-center gap-3">
        <label className={`font-medium ${coffee.textDark}`}>
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-3 py-1"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      <h2
        className={`text-xl font-semibold ${coffee.textDark} mb-3 flex items-center gap-2`}
      >
        <CalendarCheck /> Today’s Attendance
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#6b4226] text-white">
              <th className="p-3">Employee</th>
              <th className="p-3">Branch</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((a) => (
                <tr
                  key={a.id}
                  className="bg-white odd:bg-[#fcf9f6] border-b"
                >
                  <td className="p-3">
                    {employees.find((e) => e.id === a.employeeId)?.name || "-"}
                  </td>
                  <td className="p-3">
                    {branchName(
                      employees.find((e) => e.id === a.employeeId)?.branchId
                    )}
                  </td>
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        a.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No attendance records for this date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Leave Requests table (unchanged) */}
      <h2
        className={`text-xl font-semibold ${coffee.textDark} my-4 flex items-center gap-2`}
      >
        <CalendarX /> Leave Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#6b4226] text-white">
              <th className="p-3">Employee</th>
              <th className="p-3">Period</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((r) => (
              <tr key={r.id} className="bg-white odd:bg-[#fcf9f6] border-b">
                <td className="p-3">
                  {employees.find((e) => e.id === r.employeeId)?.name || "-"}
                </td>
                <td className="p-3">
                  {r.from} → {r.to}
                </td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      r.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : r.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => setLeaveStatus(r.id, "Approved")}
                    className="px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setLeaveStatus(r.id, "Rejected")}
                    className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
