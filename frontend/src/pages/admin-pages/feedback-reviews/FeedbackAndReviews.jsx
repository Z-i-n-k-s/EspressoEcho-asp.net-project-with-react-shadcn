import React, { useState, useEffect } from "react";
import BranchSelector from "./BranchSelector";
import Tabs from "./Tabs";
import FeedbackList from "./FeedbackList";
import ProductReviewList from "./ProductReviewList";
import feedbackApi from "@/api/Feedback_api";
import branchApi from "@/api/Branch_api";
import { useSelector } from "react-redux";

export default function FeedbackAndReviews() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedback");

  const user = useSelector((state) => state.user.user);
  const adminId = user?.id; // Logged-in admin ID

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await branchApi.getAllBranches();
      const branchArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setBranches(branchArray);
      setSelectedBranch(branchArray[0]?.id || "");
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedbacks when branch or tab changes
  useEffect(() => {
    if (activeTab === "feedback" && selectedBranch) {
      fetchFeedbacks();
    }
  }, [activeTab, selectedBranch]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await feedbackApi.getFeedbackByBranch(selectedBranch);
      const feedbackData = res.data || [];

      // Map customer to show name
      const formattedData = feedbackData.map((f) => ({
        ...f,
        customer: {
          ...f.customer,
          user_name: f.customer?.user_name || f.customer?.phone || "Unknown",
        },
        adminId, // Attach admin ID to each feedback for replying
      }));

      setFeedbacks(formattedData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Feedback & Product Reviews
      </h1>
      {activeTab === "feedback" && (
        <BranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      )}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <p className="text-center text-[#5c4033] italic">Loading...</p>
      ) : activeTab === "feedback" ? (
        <FeedbackList
          selectedBranch={selectedBranch}
          setLoading={setLoading}
          loading={loading}
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
          adminId={adminId} // pass admin ID to FeedbackList
        />
      ) : (
        <ProductReviewList
          selectedBranch={selectedBranch}
          setFeedbacks={setFeedbacks}
          productReviews={productReviews}
          setProductReviews={setProductReviews}
        />
      )}
    </div>
  );
}
