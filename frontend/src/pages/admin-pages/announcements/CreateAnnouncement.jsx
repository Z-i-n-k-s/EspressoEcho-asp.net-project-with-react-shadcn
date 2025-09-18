import branchAnnouncementApi from "@/api/Branch_announcement_api";
import branchApi from "@/api/Branch_api";
import { PlusCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CreateAnnouncement({
  setActiveAnnouncements,
  activeAnnouncements,
}) {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("all");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [type, setType] = useState("info"); // type dropdown
  const [loading, setLoading] = useState(false); // loader state

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchApi.getAllBranches();
        setBranches(res.data?.data || res.data || []);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, []);

  // Handle create announcement
  const handleCreate = async () => {
  if (!newAnnouncement.trim()) return;

  setLoading(true);
  try {
    const payload = {
      branch_id: branch === "all" ? null : branch,
      message: newAnnouncement,
      type,
      created_by: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // temp user id
      is_active: true,
    };

    const res = await branchAnnouncementApi.create(payload);

    // Safely extract the created announcement
    const newAnn = res.data?.data || res.data || {};

    // Normalize fields to avoid undefined errors in ActiveAnnouncements
    const normalizedAnn = {
      ...newAnn,
      message:
        typeof newAnn.message === "string"
          ? newAnn.message
          : newAnn.message?.text ?? "No message",
      branch:
        typeof newAnn.branch === "string"
          ? newAnn.branch
          : newAnn.branch?.name ?? "Unknown branch",
      type: newAnn.type ?? "info",
      created_at: newAnn.created_at ?? new Date().toISOString(),
      updated_at: newAnn.updated_at ?? null,
      is_active: true,
    };

    // Add normalized announcement to state
    setActiveAnnouncements([normalizedAnn, ...activeAnnouncements]);

    // Reset input fields
    setNewAnnouncement("");
    setType("info");
    setBranch("all");
  } catch (error) {
    console.error("Failed to create announcement", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <PlusCircle className="text-green-600" /> Create Announcement
      </h2>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Branch dropdown */}
        <select
          className="border border-[#d2b48c] rounded-lg p-2"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          disabled={loading}
        >
          <option value="all">All Branches</option>
          {Array.isArray(branches) &&
            branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
        </select>

        {/* Type dropdown */}
        <select
          className="border border-[#d2b48c] rounded-lg p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
        >
          <option value="info">Info</option>
          <option value="offer">Offer</option>
          <option value="closure">Closure</option>
        </select>

        {/* Message input */}
        <input
          type="text"
          placeholder="Enter announcement message..."
          className="flex-1 border border-[#d2b48c] rounded-lg p-2"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          disabled={loading}
        />

        {/* Submit button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-[#6b4226] text-white px-4 py-2 rounded-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5c3620]"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
}
