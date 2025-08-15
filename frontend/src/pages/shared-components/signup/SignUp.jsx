import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("SignUp Data:", formData);

    // Simulating API call
    setTimeout(() => {
      alert("Sign Up Successful!");
      navigate("/login"); // Redirect to login
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <i className="fas fa-user text-gray-400 mr-3"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-transparent flex-1 outline-none py-3 text-gray-700"
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <i className="fas fa-envelope text-gray-400 mr-3"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-transparent flex-1 outline-none py-3 text-gray-700"
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <i className="fas fa-lock text-gray-400 mr-3"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-transparent flex-1 outline-none py-3 text-gray-700"
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <i className="fas fa-lock text-gray-400 mr-3"></i>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="bg-transparent flex-1 outline-none py-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
