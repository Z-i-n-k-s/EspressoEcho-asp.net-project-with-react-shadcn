import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/store/userSlice';
import { motion } from "framer-motion";
import apiClient from "@/api/ApiCilent";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120
    }
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

const coffeeVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

const steamVariants = {
  animate: {
    opacity: [0, 1, 0],
    scale: [0.8, 1.2, 1],
    y: [0, -40, -80],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeOut"
    }
  }
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    default_delivery_address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.register(formData);

      if (response.success) {
        console.log("Registration Successful", response);

        // Store tokens
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        // Store user details in Redux
        dispatch(setUserDetails(response.user_info));

        toast.success("Registration successful! Welcome!");
        
        // Navigate to customer dashboard (default role for registration)
        navigate("/");
      } else {
        // Handle API validation errors
        if (response.errors) {
          setErrors(response.errors);
        }
        
        const errorMessage = response.message || "Registration failed!";
        toast.error(errorMessage, { position: "top-center" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong during registration!";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#f8f1e5] to-[#efe0cc]">
      

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side - Brand Section with Animated Coffee */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 bg-gradient-to-br from-[#6d4c41] to-[#4e342e] text-white p-10 flex flex-col justify-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 text-9xl">☕</div>
            <div className="absolute bottom-1/3 right-1/4 text-8xl">🌱</div>
            <div className="absolute top-1/3 right-1/3 text-7xl">🍂</div>
          </div>
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl font-bold mb-6"
            >
              Espreso Echo
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl mb-8 text-amber-100 max-w-md"
            >
              Discover the perfect blend of flavor and community. Join thousands of coffee lovers who start their day with us.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Exclusive member rewards</p>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Fast delivery to your door</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Personalized coffee recommendations</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12"
            >
              <p className="text-amber-100 mb-4">Already part of our community?</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-transparent border-2 border-[#e5c185] text-[#e5c185] rounded-full font-medium hover:bg-[#e5c185] hover:text-[#4e342e] transition-colors duration-300"
              >
                Sign In
              </motion.button>
            </motion.div>
          </div>
          
          {/* Animated Coffee Cup */}
          <motion.div 
            variants={coffeeVariants}
            animate="animate"
            className="absolute bottom-10 right-10 hidden lg:block"
          >
            <div className="relative">
              {/* Steam */}
              <motion.div
                variants={steamVariants}
                animate="animate"
                className="absolute -top-20 -left-5 w-10 h-16 rounded-full bg-white/30"
              />
              <motion.div
                variants={steamVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
                className="absolute -top-24 left-5 w-8 h-14 rounded-full bg-white/40"
              />
              <motion.div
                variants={steamVariants}
                animate="animate"
                transition={{ delay: 1 }}
                className="absolute -top-20 left-12 w-6 h-12 rounded-full bg-white/20"
              />
              
              {/* Coffee Cup */}
              <div className="relative">
                <div className="w-32 h-28 bg-[#3e2723] rounded-b-full rounded-t-lg"></div>
                <div className="absolute top-0 w-32 h-24 bg-[#795548] rounded-b-full rounded-t-lg"></div>
                <div className="absolute top-0 w-32 h-20 bg-[#6d4c41] rounded-b-full rounded-t-lg"></div>
                <div className="absolute top-5 left-14 w-4 h-2 bg-[#4e342e] rounded-full"></div>
                <div className="absolute top-8 left-12 w-8 h-1 bg-[#4e342e] rounded-full"></div>
               </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-[#4e342e] mb-2 text-center"
            >
              Create Account
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#795548] text-center mb-8"
            >
              Join our community of coffee enthusiasts
            </motion.p>

            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5" 
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                    errors.full_name 
                      ? "border-red-500 focus:ring-2 focus:ring-red-300" 
                      : "border-[#bcaaa4] focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41]"
                  }`}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.full_name}
                  </motion.p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? "border-red-500 focus:ring-2 focus:ring-red-300" 
                      : "border-[#bcaaa4] focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41]"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                    errors.phone 
                      ? "border-red-500 focus:ring-2 focus:ring-red-300" 
                      : "border-[#bcaaa4] focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41]"
                  }`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                    errors.password 
                      ? "border-red-500 focus:ring-2 focus:ring-red-300" 
                      : "border-[#bcaaa4] focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41]"
                  }`}
                  placeholder="Enter password (min. 6 characters)"
                />
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                    errors.password_confirmation 
                      ? "border-red-500 focus:ring-2 focus:ring-red-300" 
                      : "border-[#bcaaa4] focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41]"
                  }`}
                  placeholder="Confirm password"
                />
                {errors.password_confirmation && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password_confirmation}
                  </motion.p>
                )}
              </motion.div>

              {/* Delivery Address (Optional) */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Default Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  name="default_delivery_address"
                  value={formData.default_delivery_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#bcaaa4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41] transition-all duration-300"
                  placeholder="123 Main St, City, Country"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#6d4c41] to-[#4e342e] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;