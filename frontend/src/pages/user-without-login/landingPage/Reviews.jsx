// src/pages/Reviews.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import feedbackApi from "@/api/Feedback_api";

const Reviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider settings
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, initialSlide: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  // Fetch all feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await feedbackApi.getAllFeedbacks(); // fetch all feedbacks
        const formattedFeedbacks = res.data.map((fb) => ({
          id: fb.id,
          name: fb.customer?.user?.full_name || "Anonymous",
          email: fb.customer?.user?.email || "",
          message: fb.message,
          reply:
            fb.replies && fb.replies.length > 0 ? fb.replies[0].message : null,
          date: fb.created_at,
          coffee: fb.branch.name,
          rating: fb.rating,
        }));
        setFeedbacks(formattedFeedbacks);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div
      id="reviews"
      className="py-20 bg-gradient-to-b from-[#3e2723] to-[#5d4037] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-20 text-9xl">☕</div>
        <div className="absolute bottom-20 right-32 text-8xl">🌱</div>
        <div className="absolute top-1/3 right-1/4 text-7xl">🍂</div>
        <div className="absolute bottom-1/4 left-1/3 text-6xl">🥄</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center text-amber-100 text-sm uppercase tracking-widest mb-2 font-semibold">
            Testimonials
          </h2>
          <h1 className="text-center text-[#e5c185] text-4xl md:text-5xl font-bold font-serif">
            From Our Coffee Lovers
          </h1>
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 bg-amber-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Feedback Slider */}
        {loading ? (
          <p className="text-center text-amber-100">Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-amber-100">No feedbacks yet.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Slider {...settings}>
              {feedbacks.map((fb) => (
                <div key={fb.id} className="px-3 py-6">
                  <motion.div
                    className="flex flex-col gap-4 shadow-2xl py-8 px-6 rounded-xl bg-gradient-to-br from-[#f9f1e3] to-[#e5c185] text-[#3e2723] hover:bg-gradient-to-br hover:from-[#9A784F] hover:to-[#2c1d19] hover:text-amber-50 transition-all duration-500 relative overflow-hidden group"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Decorative coffee stain */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-900/10 group-hover:bg-amber-700/20 transition-all duration-500"></div>

                    {/* Image */}
                    <div className="mb-4 flex justify-center relative">
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-amber-700/30 group-hover:bg-amber-500/50 blur-md transition-all duration-500"></div>
                        <img
                          src={`https://ui-avatars.com/api/?name=${fb.name}&background=795548&color=fff`}
                          alt={fb.name}
                          className="rounded-full w-20 h-20 object-cover relative z-10 border-2 border-amber-700/30 group-hover:border-amber-500/70 transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Branch as coffee type */}
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 text-xs bg-amber-700/20 text-amber-900 rounded-full group-hover:bg-amber-500/30 group-hover:text-amber-100 transition-all duration-500">
                        {fb.coffee}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center gap-4 px-2">
                      <div className="space-y-4">
                        <p className="text-sm text-center italic leading-relaxed group-hover:text-amber-100 transition-colors duration-500">
                          "{fb.message}"
                        </p>
                        <div>
                          <h2 className="text-lg font-bold font-serif text-center group-hover:text-amber-200 transition-colors duration-500">
                            {fb.name}
                          </h2>
                          <p className="text-lg font-bold font-serif text-center group-hover:text-amber-200 transition-colors duration-500">
                            {fb.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quotation marks */}
                    <div className="absolute top-4 left-4 text-amber-900/10 group-hover:text-amber-700/20 text-5xl font-serif transition-all duration-500">
                      "
                    </div>
                    <div className="absolute bottom-4 right-4 text-amber-900/10 group-hover:text-amber-700/20 text-5xl font-serif rotate-180 transition-all duration-500">
                      "
                    </div>

                    {/* Rating stars */}
                    {/* Rating stars */}
{/* Rating stars */}
<div className="flex justify-center mt-4">
  {[1, 2, 3, 4, 5].map((star) => (
    <svg
      key={star}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-colors duration-300`}
      fill={star <= fb.rating ? "#f59e0b" : "#d1d5db"} // amber-500 or gray-300
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
               9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ))}
</div>


                  </motion.div>
                </div>
              ))}
            </Slider>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
