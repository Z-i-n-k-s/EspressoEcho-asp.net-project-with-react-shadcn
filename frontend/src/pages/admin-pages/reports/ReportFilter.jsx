import { Calendar, Store } from 'lucide-react';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ReportFilter({ branch, setBranch, month, setMonth, branches }) {
  // Convert "YYYY-MM" string to a Date object for DatePicker
  const selectedDate = month ? new Date(month + '-01') : new Date();

  const handleDateChange = (date) => {
    const year = date.getFullYear();
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');
    setMonth(`${year}-${monthNum}`); // keep same YYYY-MM format
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Branch Selector */}
      <div className="flex items-center gap-2 bg-yellow-200 rounded-xl px-4 py-2 shadow">
        <Store className="text-[#6b4226]" />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="bg-transparent outline-none text-[#6b4226] font-semibold"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Month-Year Picker */}
      <div className="flex items-center gap-2 bg-yellow-200 rounded-xl px-4 py-2 shadow w-fit">
        <Calendar className="text-[#6b4226]" />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM-yyyy"
          showMonthYearPicker
          className="bg-transparent outline-none text-[#6b4226] font-semibold cursor-pointer w-32"
        />
      </div>
    </div>
  );
}
