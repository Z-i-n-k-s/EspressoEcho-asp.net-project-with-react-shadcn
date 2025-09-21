import feedbackReplyApi from "@/api/Feedback_api_reply";
import { Send, Star, Trash2, Edit3 } from "lucide-react";
import React, { useState, useEffect } from "react";


export default function RenderCard({ item,  adminId }) {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [editingReply, setEditingReply] = useState(null);
  const [loadingReplies, setLoadingReplies] = useState(true);

  // Fetch replies
  const fetchReplies = async () => {
  try {
    setLoadingReplies(true);
    const res = await feedbackReplyApi.getRepliesByFeedback(item.id);
    console.log("Fetched replies:", res);
    setReplies(Array.isArray(res.data) ? res.data : []); 
  } catch (error) {
    console.error("Error fetching replies:", error);
    setReplies([]);
  } finally {
    setLoadingReplies(false);
  }
};


  useEffect(() => {
    fetchReplies();
  }, [item.id]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return alert("Enter a reply before sending.");

    try {
      await feedbackReplyApi.createReply({
        feedback_id: item.id,
        responder_id: adminId,
        responder_role: "admin",
        message: replyText,
      });
      setReplyText("");
      fetchReplies();
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Check console for details.");
    }
  };

  const handleUpdateReply = async (replyId) => {
    if (!replyText.trim()) return alert("Enter updated reply text.");

    try {
      await feedbackReplyApi.updateReply(replyId, { message: replyText });
      setReplyText("");
      setEditingReply(null);
      fetchReplies();
    } catch (error) {
      console.error("Failed to update reply:", error);
      alert("Failed to update reply. Check console for details.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      await feedbackReplyApi.deleteReply(replyId);
      fetchReplies();
    } catch (error) {
      console.error("Failed to delete reply:", error);
      alert("Failed to delete reply. Check console for details.");
    }
  };

  return (
    <div
      key={item.id}
      className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition"
    >
      <div className="mb-3">
        {item.subject && (
          <h2 className="text-xl font-semibold text-[#3f2c1d] mb-1">
            {item.subject}
          </h2>
        )}
        <p className="text-lg text-[#7b5e4b]">
          By {item.customer?.user_name || item.customer?.phone || "Unknown"} •{" "}
          {new Date(item.created_at).toLocaleString()}
        </p>
      </div>

      <p className="text-lg text-[#5c4033] mb-3">{item.message}</p>

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Reply Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1 p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c19a6b]"
        />
        <button
          onClick={() =>
            editingReply ? handleUpdateReply(editingReply) : handleSendReply()
          }
          className="bg-[#6b4226] hover:bg-[#5c4033] text-white p-2 rounded-lg flex items-center"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Replies List */}
      <div className="space-y-2">
        {loadingReplies ? (
          <p className="text-[#5c4033] italic">Loading replies...</p>
        ) : replies.length > 0 ? (
          replies.map((r) => (
            <div
              key={r.id}
              className="bg-[#fff3e0] p-3 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="text-[#3f2c1d]">{r.message}</p>
                <small className="text-[#7b5e4b]">
                  By {r.responder?.name || "Admin"} • {new Date(r.replied_at).toLocaleString()}
                </small>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setReplyText(r.message);
                    setEditingReply(r.id);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteReply(r.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#5c4033] italic">No replies yet.</p>
        )}
      </div>
    </div>
  );
}
