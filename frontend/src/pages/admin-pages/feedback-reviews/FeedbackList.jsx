import React from "react";
import RenderCard from "./RenderCard";
import feedbackReplyApi from "@/api/Feedback_api_reply";


export default function FeedbackList({
  feedbacks,
  setFeedbacks,
  adminId,
  loading
}) {

  // Fetch replies for each feedback
  const fetchReplies = async (feedbackId) => {
    try {
      const res = await feedbackReplyApi.getRepliesByFeedback(feedbackId);
      return res || [];
    } catch (error) {
      console.error("Error fetching replies:", error);
      return [];
    }
  };

  return (
    <div className="grid gap-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading feedbacks...
          </span>
        </div>
      ) : feedbacks.length > 0 ? (
        feedbacks.map((f) => (
          <RenderCard
            key={f.id}
            item={f}
            adminId={adminId}
            fetchReplies={fetchReplies}
            setFeedbacks={setFeedbacks}
          />
        ))
      ) : (
        <p className="text-center text-[#5c4033] italic">No feedback found.</p>
      )}
    </div>
  );
}
