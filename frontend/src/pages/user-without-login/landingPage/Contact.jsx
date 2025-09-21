import React, { useState, useEffect } from "react";
import Bg from "../../../assets/bg.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const bgImage = {
  backgroundImage: `url(${Bg})`,
  backgroundColor: "#270c03",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = !!user;

  // Auto-fill user data when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || user.name || "",
        email: user.email || ""
      }));
    }
    
    // Still load saved form data for non-autofilled fields
    const savedFormData = localStorage.getItem('contactFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(prev => ({
        ...prev,
        message: parsedData.message || ""
      }));
    }
  }, [isLoggedIn, user]);

  const handleChange = (e) => {
    // Only allow changing the message field if user is logged in
    if (isLoggedIn && (e.target.name === 'name' || e.target.name === 'email')) {
      return; // Prevent changing name and email
    }
    
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    // Save form data to localStorage as user types (only message for logged-in users)
    localStorage.setItem('contactFormData', JSON.stringify(newFormData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Save form data and redirect to login
      localStorage.setItem('contactFormData', JSON.stringify(formData));
      localStorage.setItem('redirectAfterLogin', '/contact');
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const storedFeedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];
      console.log("Current stored feedbacks:", storedFeedbacks);
      
      const newFeedback = {
        id: Date.now(),
        ...formData,
        userId: user?.id || null,
        date: new Date().toISOString(),
        reply: "" // Admin can later fill this
      };

      console.log("New feedback being added:", newFeedback);
      
      const updatedFeedbacks = [newFeedback, ...storedFeedbacks];
      localStorage.setItem("userFeedbacks", JSON.stringify(updatedFeedbacks));

      // Verify the data was stored correctly
      const verifyStorage = JSON.parse(localStorage.getItem("userFeedbacks")) || [];
      console.log("After saving, storage contains:", verifyStorage);

      // Clear only the message field, keep name and email
      setFormData(prev => ({ ...prev, message: "" }));
      localStorage.removeItem('contactFormData');
      
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div
      id="contact"
      style={bgImage}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="w-full max-w-3xl bg-amber-900/20 rounded-lg shadow-md p-8"
      >
        <h1 className="text-3xl font-bold text-center text-[#4e342e] mb-6 font-cursive">
          --Contact Us--
        </h1>
        <p className="text-center text-lg text-black mb-8 font-cursive">
          We would love to hear from you! Fill out the form below and we'll get
          back to you as soon as possible.
        </p>

        {!isLoggedIn ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-medium">Note:</p>
            <p>You need to be logged in to submit feedback. Your form data will be saved.</p>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-6 rounded">
            <p className="font-medium">Welcome, {user.full_name || user.name}!</p>
            <p>Your contact information has been auto-filled from your account.</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isLoggedIn} // Disable if logged in
            />
            {isLoggedIn && (
              <p className="text-xs text-gray-500 mt-1">Name is auto-filled from your account</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isLoggedIn} // Disable if logged in
            />
            {isLoggedIn && (
              <p className="text-xs text-gray-500 mt-1">Email is auto-filled from your account</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Your feedback or message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-amber-900 text-white font-semibold rounded-lg shadow-md hover:bg-amber-950 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Or reach us directly:</p>
          <p className="font-semibold text-black">+1 (123) 456-7890</p>
          <p className="font-semibold text-black">info@coffeewebsite.com</p>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your feedback has been submitted successfully.
              </p>
              <button
                onClick={closeModal}
                className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-950 transition duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Contact;