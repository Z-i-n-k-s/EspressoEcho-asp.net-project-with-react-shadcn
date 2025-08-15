import React, { useState, useEffect } from "react";
import BranchSelector from "./BranchSelector";
import Tabs from "./Tabs";
import FeedbackList from "./FeedbackList";
import ProductReviewList from "./ProductReviewList";

export default function FeedbackAndReviews() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedback");

  useEffect(() => {
    fetchBranches();
  }, []);



  const fetchBranches = async () => {
    // Mock branches
    const data = [
      { id: "b1", name: "Downtown Branch" },
      { id: "b2", name: "Uptown Branch" },
    ];
    setBranches(data);
    setSelectedBranch(data[0]?.id || "");
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        ☕ Feedback & Product Reviews
      </h1>

      {/* Branch Selector */}
      <BranchSelector
        branches={branches}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* {loading ? (
        <p className="text-center text-[#5c4033] italic">Loading...</p>
      ) : */}{ activeTab === "feedback" ? ( 
        <FeedbackList
          selectedBranch={selectedBranch}
          setLoading={setLoading}
          loading={loading}
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
          setProductReviews={setProductReviews}
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
