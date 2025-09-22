// src/pages/UserFeedbackForm.js
import branchApi from "@/api/Branch_api";
import feedbackApi from "@/api/Feedback_api";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Coffee, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/pages/user-without-login/componets/Header";
import Footer from "@/pages/user-without-login/componets/Footer";


const UserFeedbackForm = () => {
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  console.log("User role:", role);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [status] = useState("open");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchApi.getAllBranches();
        setBranches(res.data);
        if (res.data.length > 0) setBranchId(res.data[0].id);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      }
    };
    fetchBranches();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow p-8 text-center">
          <h2 className="text-xl font-semibold text-[#5d4037]">
            Please log in to submit feedback
          </h2>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 bg-[#6d4c41] text-white px-6 py-2 rounded-lg shadow hover:bg-[#4e342e] transition-colors"
          >
            Go to Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = {
        customer_id: user.id,
        branch_id: branchId,
        subject,
        message,
        rating,
        status,
      };

      await feedbackApi.createFeedback(data);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center 
        bg-gradient-to-br from-[#9c756c] via-[#6d4c41] to-[#3e2723] py-30">
          
        <div className="max-w-2xl mx-auto px-6 w-full">
          <div className="bg-gradient-to-br from-[#6d4c41] via-[#5d4037] to-[#3e2723] rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Coffee icon background */}
            <div className="absolute -top-6 -right-6 text-[10rem] text-[#795548]/10">
              <Coffee />
            </div>

            <h2 className="text-3xl font-bold text-center text-amber-100 mb-6 font-serif">
              Share Your Coffee Experience
            </h2>

            {errorMsg && (
              <p className="text-red-400 text-center mb-4">{errorMsg}</p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 text-[#3e2723]"
            >
              {/* Branch Dropdown */}
              <div>
                <label className="block text-amber-100 mb-2 font-medium">
                  Select Branch
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-[#f9f1e3] focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  required
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-amber-100 mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loved the latte art!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-[#f9f1e3] focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-amber-100 mb-2 font-medium">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us about your coffee experience..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-[#f9f1e3] focus:ring-2 focus:ring-amber-400 focus:outline-none h-32 resize-none"
                  required
                />
              </div>

              {/* Rating as Stars */}
              <div>
                <label className="block text-amber-100 mb-2 font-medium">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-none text-amber-200 hover:text-amber-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#6d4c41] via-[#5d4037] to-[#3e2723] rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 text-amber-100 hover:text-amber-200"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Coffee className="w-16 h-16 text-amber-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-amber-100 mb-4">
                  Thank You!
                </h3>
                
                <p className="text-amber-100 mb-6">
                  Thanks for your feedback! We appreciate it.
                </p>
                
                <button
                  onClick={handleModalClose}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default UserFeedbackForm;