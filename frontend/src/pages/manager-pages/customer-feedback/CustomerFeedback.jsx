import React, { useState, useEffect } from "react";
import { Star, CheckCircle, Clock, Send } from "lucide-react";

export default function CustomerFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // Replace with real API call
      const data = [
        {
          id: 1,
          customer: "John Doe",
          subject: "Great Cappuccino",
          message:
            "The coffee was perfect, but the waiting time was a bit long.",
          rating: 4,
          category: "Product Review",
          status: "in_progress", // default for new feedbacks
          created_at: "2025-08-07",
        },
        {
          id: 2,
          customer: "Sophia Smith",
          subject: "Staff was very friendly",
          message: "Loved the service! The cashier was very polite.",
          rating: 5,
          category: "Staff Behaviour",
          status: "closed",
          created_at: "2025-08-06",
        },
      ];
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const sendReply = async (id) => {
    if (!replyText[id] || replyText[id].trim() === "") {
      alert("Please enter a reply before sending.");
      return;
    }
    try {
      await fetch(`/api/feedbacks/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText[id] }),
      });

      setReplyText((prev) => ({ ...prev, [id]: "" }));
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
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
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        📋 Customer Feedback
      </h1>

      {loading ? (
        <p className="text-center text-[#5c4033] italic">
          Loading feedbacks...
        </p>
      ) : feedbacks.length === 0 ? (
        <p className="text-center text-[#5c4033]">No feedbacks available.</p>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition duration-200 ease-in-out"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#3f2c1d]">
                    {fb.subject}
                  </h2>
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
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < fb.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Reply Box — only show if status is in_progress */}
              {fb.status === "in_progress" && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[fb.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [fb.id]: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c19a6b]"
                  />
                  <button
                    onClick={() => sendReply(fb.id)}
                    className="bg-[#6b4226] hover:bg-[#5c4033] text-white p-2 rounded-lg flex items-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
