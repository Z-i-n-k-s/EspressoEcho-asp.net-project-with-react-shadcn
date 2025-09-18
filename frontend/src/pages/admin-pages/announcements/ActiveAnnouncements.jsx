import { Archive, Megaphone } from "lucide-react";
import React from "react";
import branchAnnouncementApi from "@/api/Branch_announcement_api";

export default function ActiveAnnouncements({
  activeAnnouncements,
  setActiveAnnouncements,
  setArchivedAnnouncements,
  archivedAnnouncements,
}) {
  const handleArchive = async (id) => {
    try {
      // find the item
      const item = activeAnnouncements.find((a) => a.id === id);
      if (!item) return;

      // update backend: set is_active = false
      const updated = await branchAnnouncementApi.update(id, {
        ...item,
        is_active: false,
      });

      // update UI state
      setActiveAnnouncements(activeAnnouncements.filter((a) => a.id !== id));
      setArchivedAnnouncements([
        updated.data || updated,
        ...archivedAnnouncements,
      ]);
    } catch (error) {
      console.error("Failed to archive announcement", error);
    }
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
          {activeAnnouncements.map((a) => {
            console.log("Active item:", a);

            // Safely access fields
            const message =
              typeof a.message === "string"
                ? a.message
                : a.message?.text ?? "No message";

            const branch =
              typeof a.branch === "string"
                ? a.branch
                : a.branch?.name ?? "Unknown branch";

            const date = a.created_at
              ? new Date(a.created_at).toLocaleString()
              : "No date";
              const type = a.type ?? "Unknown";
            return (
              <li
                key={a.id}
                className="flex justify-between items-center bg-[#fdf6f0] p-3 rounded-lg border border-[#e7dcd3]"
              >
                <div>
                  <p className="font-bold text-[#3f2c1d]">{message}</p>
                  <p className="text-sm text-[#7b5e4b]">
                    {branch} • {date} • {type}
                  </p>
                </div>
                <button
                  onClick={() => handleArchive(a.id)}
                  className="text-yellow-700 hover:text-yellow-900"
                >
                  <Archive />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
