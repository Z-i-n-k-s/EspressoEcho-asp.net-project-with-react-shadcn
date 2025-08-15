import { CheckCircle2 } from 'lucide-react'
import React from 'react'

export default function ArchivedAnnouncements({ archivedAnnouncements }) {
    
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-3 flex items-center gap-2">
          <CheckCircle2 className="text-green-600" /> Archived Announcements
        </h2>
        {archivedAnnouncements.length === 0 ? (
          <p className="italic text-[#7b5e4b]">No archived announcements</p>
        ) : (
          <ul className="space-y-3">
            {archivedAnnouncements.map((a) => (
              <li
                key={a.id}
                className="bg-[#fdf6f0] p-3 rounded-lg border border-[#e7dcd3]"
              >
                <p className="font-bold text-[#3f2c1d]">{a.message}</p>
                <p className="text-sm text-[#7b5e4b]">
                  {a.branch} • {a.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
  )
}
