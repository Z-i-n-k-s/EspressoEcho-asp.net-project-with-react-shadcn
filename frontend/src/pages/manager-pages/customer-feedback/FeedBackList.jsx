import React, { useEffect, useState } from 'react'
import FeedBackItem from './FeedBackItem';

export default function FeedBackList() {
    const [feedbacks, setFeedbacks] = useState([]);
      const [loading, setLoading] = useState(true);
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

      if (loading) {
    return <p className="text-center text-[#5c4033] italic">Loading feedbacks...</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="text-center text-[#5c4033]">No feedbacks available.</p>;
  }
  return (
    
        <div className="grid gap-6">
          {feedbacks.map((fb) => (
           <FeedBackItem key={fb.id} fb={fb} setFeedbacks={setFeedbacks} />
          ))}
        </div>
      
  );
}
