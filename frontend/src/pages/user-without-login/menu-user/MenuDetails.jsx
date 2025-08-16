import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Header from "@/pages/user-without-login/componets/Header";

const MenuDetails = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([
    { id: 1, user: "Alice", rating: 5, comment: "Absolutely loved it! So rich and tasty." },
    { id: 2, user: "Rahim", rating: 4, comment: "Great flavor, could be a bit stronger." },
  ]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  // For modal feedback
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ emoji: "", message: "" });

const handleAddReview = () => {
  if (!newReview.trim() || newRating === 0) return;

  const review = {
    id: Date.now(),
    user: "Guest", // Replace with actual username if available
    productId: product.id,
    productName: product.name,
    rating: newRating,
    comment: newReview,
    date: Date.now(),
  };

  // Update local review state
  setReviews([review, ...reviews]);

  // Save to localStorage for persistent history
  const storedReviews = JSON.parse(localStorage.getItem("userReviews")) || [];
  localStorage.setItem("userReviews", JSON.stringify([review, ...storedReviews]));

  // Reset inputs
  setNewReview("");
  setNewRating(0);

  // Modal feedback
  if (newRating >= 4) setModalData({ emoji: "😊", message: "Glad you loved it!" });
  else if (newRating === 3) setModalData({ emoji: "😐", message: "Thanks! We’ll try to improve." });
  else setModalData({ emoji: "😞", message: "Sorry it wasn’t great!" });
  setShowModal(true);
};


  return (
    <div className="min-h-screen bg-[#e5c185] flex flex-col">
      <Header />

      <div className="flex-1 flex justify-center items-center px-6 py-10 mt-20">
        <div className="relative bg-[#fdf6ec] rounded-2xl shadow-2xl w-full max-w-5xl p-8 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-[#4e342e] hover:text-black"
          >
            <X size={28} />
          </button>

          {/* Product Info + Reviews in one box */}
          <div className="space-y-10">
            {/* Product Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:w-1/2 h-72 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1 text-[#4e342e]">
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <p className="mb-2 text-lg">
                  Category: <span className="font-semibold">{product.category}</span>
                </p>
                <p className="mb-4">{product.description}</p>
                <p className="text-2xl font-bold">Tk {product.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-[#fff8f0] rounded-xl p-6 shadow-inner border border-[#e5c185]">
              <h3 className="text-2xl font-semibold mb-4 text-[#4e342e]">Customer Reviews</h3>

              {/* Add Review */}
              <div className="mb-6">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-3 rounded bg-[#f5f1e6] text-[#4e342e] placeholder-gray-600"
                />

                {/* Star Rating */}
                <div className="flex items-center gap-4 mt-3">
                  <label className="text-[#4e342e]">Rating:</label>
                  <div className="flex gap-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-2xl ${
                          star <= newRating ? "text-yellow-500" : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handleAddReview}
                    className="ml-4 px-4 py-2 bg-[#4e342e] text-[#fdf6ec] font-semibold rounded-lg hover:bg-[#3b2720]"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-[#4e342e]">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-[#e5c185] p-4 rounded-lg">
                      <p className="font-semibold text-[#4e342e] flex items-center gap-2">
                        {rev.user} –
                        <span className="text-yellow-600">
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </span>
                      </p>
                      <p className="text-[#4e342e]">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Feedback Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-[#e5c185] p-10 rounded-2xl shadow-2xl text-center w-96 h-72 flex flex-col justify-center items-center">
      <div className="text-6xl mb-6">{modalData.emoji}</div>
      <p className="text-xl font-bold text-[#4e342e]">{modalData.message}</p>
      <button
        onClick={() => setShowModal(false)}
        className="mt-6 px-6 py-3 bg-[#4e342e] text-[#fdf6ec] rounded-lg hover:bg-[#3b2720]"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default MenuDetails;
