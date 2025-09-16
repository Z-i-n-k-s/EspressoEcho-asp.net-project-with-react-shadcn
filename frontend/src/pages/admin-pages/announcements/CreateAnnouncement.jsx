import branchAnnouncementApi from "@/api/Branch_announcement_api";
import branchApi from "@/api/Branch_api";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CreateAnnouncement({
  setActiveAnnouncements,
  activeAnnouncements,
}) {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("all");
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchApi.getAllBranches();
        setBranches(res.data || []); // assuming { data: [...] }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, []);

  // Handle create announcement
  const handleCreate = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      const payload = {
        branch_id: branch === "all" ? null : branch, // null = all branches
        message: newAnnouncement,
        type: "info", // you can make this dynamic later
        created_by: "YOUR_USER_ID", // TODO: replace with logged-in user
        is_active: true,
      };

      const res = await branchAnnouncementApi.create(payload);

      // Prepend newly created announcement
      setActiveAnnouncements([res.data, ...activeAnnouncements]);
      setNewAnnouncement("");
    } catch (error) {
      console.error("Failed to create announcement", error);
    }
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
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
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
