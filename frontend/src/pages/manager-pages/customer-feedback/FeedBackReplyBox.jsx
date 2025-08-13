import { Send } from "lucide-react";
import React from "react";

export default function FeedBackReplyBox({ fb, replyText, setReplyText }) {
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
  return (
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
  );
}
