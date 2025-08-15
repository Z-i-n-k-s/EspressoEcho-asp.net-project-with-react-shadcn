import { PlusCircle } from "lucide-react";
import React from "react";

export default function CreateAnnouncement({
  branch,
  setBranch,
  newAnnouncement,
  setNewAnnouncement,
  setActiveAnnouncements,
  activeAnnouncements,
}) {
  const handleCreate = () => {
    if (!newAnnouncement.trim()) return;
    const newItem = {
      id: Date.now(),
      branch: branch === "all" ? "All" : branch,
      message: newAnnouncement,
      date: new Date().toISOString().split("T")[0],
    };
    setActiveAnnouncements([newItem, ...activeAnnouncements]);
    setNewAnnouncement("");
  };
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <PlusCircle className="text-green-600" /> Create Announcement
      </h2>
      <div className="flex flex-col lg:flex-row gap-4">
        <select
          className="border border-[#d2b48c] rounded-lg p-2"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="all">All Branches</option>
          <option value="Downtown">Downtown</option>
          <option value="Uptown">Uptown</option>
          <option value="Riverside">Riverside</option>
        </select>
        <input
          type="text"
          placeholder="Enter announcement message..."
          className="flex-1 border border-[#d2b48c] rounded-lg p-2"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-[#6b4226] text-white px-4 py-2 rounded-lg hover:bg-[#5c3620] transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
