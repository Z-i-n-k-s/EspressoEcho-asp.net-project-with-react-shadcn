import React, { useState, useEffect } from "react";
import { Archive, PlusCircle, CheckCircle2, Megaphone } from "lucide-react";
import CreateAnnouncement from "./CreateAnnouncement";
import ActiveAnnouncements from "./ActiveAnnouncements";
import ArchivedAnnouncements from "./ArchivedAnnouncements";

export default function Announcements() {
  const [branch, setBranch] = useState("all");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [activeAnnouncements, setActiveAnnouncements] = useState([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Mock data
    const mockActive = [
      {
        id: 1,
        branch: "All",
        message: "Holiday offer starts tomorrow!",
        date: "2025-08-10",
      },
      {
        id: 2,
        branch: "Downtown",
        message: "Machine maintenance at 2 PM",
        date: "2025-08-12",
      },
    ];

    const mockArchived = [
      {
        id: 3,
        branch: "Uptown",
        message: "New seasonal menu launched",
        date: "2025-07-01",
      },
    ];

    // Initially set mock data
    setActiveAnnouncements(mockActive);
    setArchivedAnnouncements(mockArchived);

    // Example backend API call
    const fetchAnnouncements = async () => {
      try {
        const data = await new Promise((resolve) => setTimeout(resolve, 800)); //simulate api delay show loading

        // Assuming backend returns { active: [], archived: [] }
        if (data.active) setActiveAnnouncements(data.active);
        if (data.archived) setArchivedAnnouncements(data.archived);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] flex items-center gap-2">
        📢 Announcements
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading Announcements...
          </span>
        </div>
      ) : (
        <>
          {/* Create Announcement= handles creating announcements form*/}
          <CreateAnnouncement
            branch={branch}
            setBranch={setBranch}
            newAnnouncement={newAnnouncement}
            setNewAnnouncement={setNewAnnouncement}
            setActiveAnnouncements={setActiveAnnouncements}
            activeAnnouncements={activeAnnouncements}
          />

          {/* Active Announcements = seeing the new created active announcements */}
          <ActiveAnnouncements
            activeAnnouncements={activeAnnouncements}
            setActiveAnnouncements={setActiveAnnouncements}
            setArchivedAnnouncements={setArchivedAnnouncements}
            archivedAnnouncements={archivedAnnouncements}
          />

          {/* Archived Announcements = deleted announcements from active can be seen here */}
          <ArchivedAnnouncements
            archivedAnnouncements={archivedAnnouncements}
          />
        </>
      )}
    </div>
  );
}
