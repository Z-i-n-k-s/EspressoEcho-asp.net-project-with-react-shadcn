import { Archive, Megaphone } from 'lucide-react'
import React from 'react'

export default function ActiveAnnouncements({ activeAnnouncements, setActiveAnnouncements, setArchivedAnnouncements, archivedAnnouncements }) {
    const handleArchive = (id) => {
    const item = activeAnnouncements.find((a) => a.id === id);
    setActiveAnnouncements(activeAnnouncements.filter((a) => a.id !== id));
    setArchivedAnnouncements([item, ...archivedAnnouncements]);
  };
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-3 flex items-center gap-2">
          <Megaphone className="text-orange-500" /> Active Announcements
        </h2>
        {activeAnnouncements.length === 0 ? (
          <p className="italic text-[#7b5e4b]">No active announcements</p>
        ) : (
          <ul className="space-y-3">
            {activeAnnouncements.map((a) => (
              <li
                key={a.id}
                className="flex justify-between items-center bg-[#fdf6f0] p-3 rounded-lg border border-[#e7dcd3]"
              >
                <div>
                  <p className="font-bold text-[#3f2c1d]">{a.message}</p>
                  <p className="text-sm text-[#7b5e4b]">
                    {a.branch} • {a.date}
                  </p>
                </div>
                <button
                  onClick={() => handleArchive(a.id)}
                  className="text-yellow-700 hover:text-yellow-900"
                >
                  <Archive />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
  )
}
