import React, { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import CreateAnnouncement from "./CreateAnnouncement";
import ActiveAnnouncements from "./ActiveAnnouncements";
import ArchivedAnnouncements from "./ArchivedAnnouncements";
import branchAnnouncementApi from "@/api/Branch_announcement_api";

export default function Announcements() {
  const [activeAnnouncements, setActiveAnnouncements] = useState([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await branchAnnouncementApi.getAll();

        // API may return { data: [...] } or just [...]
        const all = res.data || res;

        // Normalize data: ensure message, branch, and date are strings or safe values
        const normalized = all.map((a) => ({
          ...a,
          message:
            typeof a.message === "string"
              ? a.message
              : a.message?.text ?? "No message",
          branch:
            typeof a.branch === "string"
              ? a.branch
              : a.branch?.name ?? "Unknown branch",
          date: a.date ?? "No date",
        }));

        const active = normalized.filter((a) => a.is_active);
        const archived = normalized.filter((a) => !a.is_active);

        setActiveAnnouncements(active);
        setArchivedAnnouncements(archived);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] flex items-center gap-2">
        <Megaphone className="text-orange-500" /> Announcements
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
          {/* Create new announcement */}
          <CreateAnnouncement
            setActiveAnnouncements={setActiveAnnouncements}
            activeAnnouncements={activeAnnouncements}
          />

          {/* Active Announcements */}
          <ActiveAnnouncements
            activeAnnouncements={activeAnnouncements}
            setActiveAnnouncements={setActiveAnnouncements}
            setArchivedAnnouncements={setArchivedAnnouncements}
            archivedAnnouncements={archivedAnnouncements}
          />

          {/* Archived Announcements */}
          <ArchivedAnnouncements archivedAnnouncements={archivedAnnouncements} />
        </>
      )}
    </div>
  );
}
