import Header from "@/pages/user-without-login/componets/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log("UserFeedback component mounted");
    console.log("Current user:", user);
    
    const storedFeedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];
    console.log("All feedbacks in localStorage:", storedFeedbacks);
    
    // Filter feedbacks to only show those from the current user
    if (user && user.email) {
      console.log("Filtering for user email:", user.email);
      const userFeedbacks = storedFeedbacks.filter(fb => fb.email === user.email);
      console.log("Filtered user feedbacks:", userFeedbacks);
      setFeedbacks(userFeedbacks);
    } else {
      // If no user is logged in, show empty array
      console.log("No user logged in, showing empty feedbacks");
      setFeedbacks([]);
    }
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Function to manually refresh feedbacks
  const refreshFeedbacks = () => {
    console.log("Manual refresh triggered");
    const storedFeedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];
    console.log("Current stored feedbacks:", storedFeedbacks);
    
    if (user && user.email) {
      const userFeedbacks = storedFeedbacks.filter(fb => fb.email === user.email);
      console.log("Refreshed user feedbacks:", userFeedbacks);
      setFeedbacks(userFeedbacks);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f1e5] to-[#e5c185] flex flex-col">
      <Header />

      <div className="flex-1 pt-28 pb-12 px-4 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#4e342e] mb-3 font-serif">
              My Feedback History
            </h1>
            <p className="text-[#795548] text-lg max-w-2xl mx-auto">
              Review your submitted feedback and any responses from our team
            </p>
            
            {/* Debug button - can be removed after fixing */}
            {user && (
              <button 
                onClick={refreshFeedbacks}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              >
                Refresh Feedbacks
              </button>
            )}
          </div>

          {!user ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-lg border border-amber-200"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4e342e] mb-2">Authentication Required</h3>
              <p className="text-[#795548] mb-4">Please log in to view your feedback history</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-[#6d4c41] text-white px-6 py-2 rounded-lg hover:bg-[#4e342e] transition-colors duration-300"
              >
                Go to Login
              </button>
            </motion.div>
          ) : feedbacks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-lg border border-amber-200"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4e342e] mb-2">No Feedback Yet</h3>
              <p className="text-[#795548] mb-4">You haven't submitted any feedback yet</p>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="bg-[#6d4c41] text-white px-6 py-2 rounded-lg hover:bg-[#4e342e] transition-colors duration-300"
              >
                Submit Feedback
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {feedbacks.map((fb) => (
                <motion.div
                  key={fb.id}
                  variants={itemVariants}
                  className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                    <div>
                      <h2 className="font-semibold text-[#4e342e] text-lg">{fb.name}</h2>
                      <p className="text-[#8d6e63] text-sm">{fb.email}</p>
                    </div>
                    <span className="text-[#a1887f] text-sm whitespace-nowrap">
                      {new Date(fb.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {new Date(fb.date).toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-[#5d4037] font-medium mb-2">Your Feedback:</h3>
                    <p className="text-gray-700 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                      {fb.message}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[#f5f1e6] to-[#f3e5c5] rounded-lg border border-amber-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#6d4c41] rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-[#4e342e]">Admin Response</h3>
                    </div>
                    <p className="text-[#5d4037] pl-11">
                      {fb.reply ? (
                        <span className="bg-white p-3 rounded-lg block border-l-4 border-[#6d4c41]">
                          {fb.reply}
                        </span>
                      ) : (
                        <span className="text-[#a1887f] italic">
                          No response yet. We appreciate your feedback and will respond soon.
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#4e342e] to-transparent opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default UserFeedback;