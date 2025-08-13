import { Calendar } from 'lucide-react'
import React from 'react'

export default function DateSelector({ date, onChange }) {
  return (
   <div className="flex items-center gap-2 bg-yellow-200 rounded-xl px-4 py-2 shadow">
          <Calendar className="text-[#6b4226]" />
          <input
            type="date"
            value={date}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent outline-none text-[#6b4226] font-semibold"
          />
        </div>
  )
}
