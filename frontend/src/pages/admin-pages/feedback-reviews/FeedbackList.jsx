import React, { useEffect } from "react";
import RenderCard from "./RenderCard";

export default function FeedbackList({
  selectedBranch,
  setLoading,
  setProductReviews,
  feedbacks,
  setFeedbacks,
  loading
}) {
  useEffect(() => {
    if (selectedBranch) {
      fetchFeedbacks();
    }
  }, [selectedBranch]);

  const fetchFeedbacks = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));//simulate api delay show loading
    setLoading(true);
    try {
      // Mock feedback data per branch
      const mockFeedbacks = {
        b1: [
          {
            id: 1,
            customer: "John Doe",
            subject: "Great Cappuccino",
            message: "Perfect coffee, long wait.",
            rating: 4,
            category: "Product Review",
            status: "in_progress",
            created_at: "2025-08-07",
          },
          {
            id: 2,
            customer: "Emily Clark",
            subject: "Friendly Staff",
            message: "The barista was very welcoming.",
            rating: 5,
            category: "Staff Behaviour",
            status: "closed",
            created_at: "2025-08-05",
          },
        ],
        b2: [
          {
            id: 3,
            customer: "Michael Lee",
            subject: "Latte could be hotter",
            message: "Taste was good but the drink was lukewarm.",
            rating: 3,
            category: "Product Review",
            status: "in_progress",
            created_at: "2025-08-06",
          },
          {
            id: 4,
            customer: "Sarah Kim",
            subject: "Clean Environment",
            message: "The seating area was spotless, very nice!",
            rating: 5,
            category: "Store Ambience",
            status: "closed",
            created_at: "2025-08-04",
          },
        ],
      };

      setFeedbacks(mockFeedbacks[selectedBranch] || []);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid gap-6">
       {feedbacks.length === 0 && loading ? (
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
          type="feedback"
          setFeedbacks={setFeedbacks}
          setProductReviews={setProductReviews}
        />
      ))
    ) : (
      <p className="text-center text-[#5c4033] italic">No feedback found.</p>
    )}
    </div>
  );
}
