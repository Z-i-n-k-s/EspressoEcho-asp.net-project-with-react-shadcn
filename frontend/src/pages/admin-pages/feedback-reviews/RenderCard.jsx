import { CheckCircle, Clock, Send, Star } from 'lucide-react';
import React, { useState } from 'react'

export default function RenderCard({
    item,
    type,
    setFeedbacks,
    setProductReviews
}) {
  const [replyText, setReplyText] = useState({});
    const closeItem = (type, id) => {
    if (type === "feedback") {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "closed" } : f))
      );
    } else {
      setProductReviews((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "closed" } : p))
      );
    }
  };

  const sendReply = (type, id) => {
    if (!replyText[id]?.trim()) return alert("Enter a reply before sending.");
    // API call...
    setReplyText((prev) => ({ ...prev, [id]: "" }));
    alert(`${type === "feedback" ? "Feedback" : "Review"} reply sent!`);
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full cursor-pointer";
    return status === "in_progress"
      ? `${base} bg-yellow-100 text-yellow-700 flex items-center gap-1`
      : `${base} bg-green-100 text-green-700 flex items-center gap-1 cursor-default`;
  };
  return (
    <div
      key={item.id}
      className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-semibold text-[#3f2c1d]">
            {type === "feedback" ? item.subject : item.product}
          </h2>
          <p className="text-sm text-[#7b5e4b]">
            By {item.customer} • {item.created_at}
          </p>
        </div>
        <span
          className={getStatusBadge(item.status)}
          onClick={() => {
            if (item.status === "in_progress") closeItem(type, item.id);
          }}
        >
          {item.status === "in_progress" && <Clock size={14} />}
          {item.status === "closed" && <CheckCircle size={14} />}
          {item.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-[#5c4033] mb-3">{item.message}</p>

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < item.rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {item.status === "in_progress" && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText[item.id] || ""}
            onChange={(e) =>
              setReplyText((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            className="flex-1 p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c19a6b]"
          />
          <button
            onClick={() => sendReply(type, item.id)}
            className="bg-[#6b4226] hover:bg-[#5c4033] text-white p-2 rounded-lg flex items-center"
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
