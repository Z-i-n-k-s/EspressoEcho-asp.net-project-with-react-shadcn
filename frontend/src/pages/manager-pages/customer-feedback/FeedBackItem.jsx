import React, { useState } from "react";
import FeedBackReplyBox from "./FeedBackReplyBox";
import RatingStars from "./RatingStars";
import { CheckCircle, Clock } from "lucide-react";

export default function FeedBackItem({ fb, setFeedbacks }) {
  const [replyText, setReplyText] = useState({});
  const closeFeedback = async (id) => {
    try {
      await fetch(`/api/feedbacks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });

      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, status: "closed" } : fb))
      );
      alert("Feedback marked as Closed!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full cursor-pointer";
    switch (status) {
      case "in_progress":
        return `${base} bg-yellow-100 text-yellow-700 flex items-center gap-1`;
      case "closed":
        return `${base} bg-green-100 text-green-700 flex items-center gap-1 cursor-default`;
      default:
        return base;
    }
  };
  return (
    <div className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition duration-200 ease-in-out">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-semibold text-[#3f2c1d]">{fb.subject}</h2>
          <p className="text-sm text-[#7b5e4b]">
            By {fb.customer} • {fb.category}
          </p>
        </div>
        <span
          className={getStatusBadge(fb.status)}
          onClick={() => {
            if (fb.status === "in_progress") closeFeedback(fb.id);
          }}
        >
          {fb.status === "in_progress" && <Clock size={14} />}
          {fb.status === "closed" && <CheckCircle size={14} />}
          {fb.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-[#5c4033] mb-3">{fb.message}</p>

      {/* Rating */}
      <RatingStars rating={fb.rating} />

      {/* Reply Box — only show if status is in_progress */}
      {fb.status === "in_progress" && (
        <FeedBackReplyBox
          fb={fb}
          replyText={replyText}
          setReplyText={setReplyText}
        />
      )}
    </div>
  );
}
