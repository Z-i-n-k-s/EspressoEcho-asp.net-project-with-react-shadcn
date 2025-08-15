import React, { useEffect, useState } from "react";
import FeedBackItem from "./FeedBackItem";

export default function CustomerFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));//simulate api delay show loading

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


  // if (feedbacks.length === 0) {
  //   return (
  //     <p className="text-center text-[#5c4033]">No feedbacks available.</p>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        📋 Customer Feedback
      </h1>

     {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading branches...
          </span>
        </div>
      ) : (
        <>
      <div className="grid gap-6">
        
        {feedbacks.map((fb) => (
          <FeedBackItem key={fb.id} fb={fb} setFeedbacks={setFeedbacks} />
        ))}
      </div>
      </>
      )}
    </div>
  );
}
