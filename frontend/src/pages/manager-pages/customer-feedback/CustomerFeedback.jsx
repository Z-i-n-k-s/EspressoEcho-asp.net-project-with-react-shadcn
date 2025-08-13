import React from "react";
import FeedBackList from "./FeedBackList";

export default function CustomerFeedback() {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        📋 Customer Feedback
      </h1>

      <FeedBackList />
    </div>
  );
}
