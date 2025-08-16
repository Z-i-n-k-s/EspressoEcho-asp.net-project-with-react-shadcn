import Header from "@/pages/user-without-login/componets/Header";
import React, { useEffect, useState } from "react";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("userReviews")) || [];
    setReviews(storedReviews);
  }, []);

  return (
    <div className="min-h-screen bg-[#e5c185]">
      <Header />

      {/* Add padding-top to account for header height */}
      <div className="pt-28 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4e342e] mb-8 text-center">
          My Review History
        </h1>

        {reviews.length === 0 ? (
          <p className="text-[#4e342e] text-center mt-10 text-lg">
            You haven’t given any reviews yet.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#f5f1e6] shadow-lg rounded-xl p-6 border-l-4 border-[#4e342e] hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-[#4e342e] text-lg">
                    {rev.productName}
                  </h2>
                  <span className="text-gray-500 text-sm">
                    {new Date(rev.date).toLocaleDateString()} •{" "}
                    {new Date(rev.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-xl">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">{rev.comment}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-[#e5c185] text-[#4e342e] text-xs px-2 py-1 rounded-full">
                    Reviewed
                  </span>
                  <span className="text-gray-400 text-xs">via MenuDetails</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
