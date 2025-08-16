import React, { useState } from "react";
import Bg from "../../../assets/bg.png";
import { motion } from "framer-motion";

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

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const storedFeedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];

    const newFeedback = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      reply: "" // Admin can later fill this
    };

    localStorage.setItem("userFeedbacks", JSON.stringify([newFeedback, ...storedFeedbacks]));

    setFormData({ name: "", email: "", message: "" });
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
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
          We would love to hear from you! Fill out the form below and we’ll get
          back to you as soon as possible.
        </p>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-900 text-white font-semibold rounded-lg shadow-md hover:bg-amber-950 transition duration-300"
          >
            Send Message
          </button>

          {success && (
            <p className="text-green-700 font-semibold text-center mt-2">
              Feedback submitted successfully!
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Or reach us directly:</p>
          <p className="font-semibold text-black">+1 (123) 456-7890</p>
          <p className="font-semibold text-black">info@coffeewebsite.com</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
