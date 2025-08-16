import Header from "@/pages/user-without-login/componets/Header";
import React, { useEffect, useState } from "react";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const storedFeedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];
    setFeedbacks(storedFeedbacks);
  }, []);

  return (
    <div className="min-h-screen bg-[#e5c185] flex flex-col">
      <Header />

      <div className="flex-1 pt-32 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-[#4e342e] mb-8 text-center">
            My Feedback History
          </h1>

          {feedbacks.length === 0 ? (
            <p className="text-[#4e342e] text-center mt-10 text-lg">
              You haven’t submitted any feedback yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {feedbacks.map((fb, index) => (
                <div
                  key={fb.id}
                  className={`w-full bg-[#f5f1e6] rounded-xl p-4 border-l-4 border-[#4e342e] shadow hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-semibold text-[#4e342e]">{fb.name}</h2>
                    <span className="text-gray-500 text-sm">
                      {new Date(fb.date).toLocaleDateString()} •{" "}
                      {new Date(fb.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">{fb.message}</p>

                  <div className="mt-1 p-3  bg-[#e5c185] rounded-lg w-full">
                    <h3 className="font-semibold text-[#4e342e] mb-1">Admin Reply:</h3>
                    <p className="text-[#4e342e]">{fb.reply ? fb.reply : "No reply yet, sorry!"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
