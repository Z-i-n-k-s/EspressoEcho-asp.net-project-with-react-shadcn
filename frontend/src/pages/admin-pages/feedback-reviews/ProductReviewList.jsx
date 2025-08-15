import React, { useEffect } from "react";
import RenderCard from "./RenderCard";

export default function ProductReviewList({
  selectedBranch,
  setFeedbacks,
  productReviews,
  setProductReviews,
}) {
  useEffect(() => {
    if (selectedBranch) {
      fetchProductReviews();
    }
  }, [selectedBranch]);

  const fetchProductReviews = async () => {
    // Mock product reviews per branch
    const mockProductReviews = {
      b1: [
        {
          id: 101,
          customer: "Alice Green",
          product: "Premium Arabica Beans",
          message: "Rich flavor, great aroma.",
          rating: 5,
          status: "closed",
          created_at: "2025-08-06",
        },
        {
          id: 102,
          customer: "Bob Smith",
          product: "Espresso Machine",
          message: "Makes excellent coffee!",
          rating: 4,
          status: "in_progress",
          created_at: "2025-08-06",
        },
      ],
      b2: [
        {
          id: 103,
          customer: "David Johnson",
          product: "Dark Roast Beans",
          message: "Too bitter for my taste.",
          rating: 2,
          status: "in_progress",
          created_at: "2025-08-05",
        },
        {
          id: 104,
          customer: "Olivia White",
          product: "Cappuccino Mix",
          message: "Easy to prepare and tastes great!",
          rating: 5,
          status: "closed",
          created_at: "2025-08-04",
        },
      ],
    };

    setProductReviews(mockProductReviews[selectedBranch] || []);
  };

  return (
    <div className="grid gap-6">
      {productReviews.length > 0
        ? productReviews.map((p) => (
            <RenderCard
              key={p.id}
              item={p}
              type="review"
              setFeedbacks={setFeedbacks}
              setProductReviews={setProductReviews}
            />
          ))
        : "No product reviews found."}
    </div>
  );
}
