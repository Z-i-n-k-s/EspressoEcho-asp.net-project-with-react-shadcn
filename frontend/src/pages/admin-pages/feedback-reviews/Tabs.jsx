import React from 'react'

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "feedback"
              ? "bg-[#6b4226] text-white"
              : "bg-white text-[#5c4033] border"
          }`}
          onClick={() => setActiveTab("feedback")}
        >
          Customer Feedback
        </button>


        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "reviews"
              ? "bg-[#6b4226] text-white"
              : "bg-white text-[#5c4033] border"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Product Reviews
        </button>
      </div>
  )
}
