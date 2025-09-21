import apiClient from "@/api/ApiCilent";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '@/store/userSlice';
import { motion } from "framer-motion";

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

const coffeeSteamVariants = {
  animate: {
    y: [0, -20, -40],
    opacity: [0, 1, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeOut"
    }
  }
};

const Login = () => {
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  console.log(user)
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        console.log("Login Successful", response);

        // Store tokens
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        // Store user details in Redux
        dispatch(setUserDetails(response.user_info));

        // Get role from response
        const roles = response.user_info.roles;
        const role = roles.length ? roles[0].toLowerCase() : "customer";

        // Navigate based on role
        switch (role) {
          case "admin":
            toast.success("Welcome to admin panel");
            navigate("/admin-panel/admin-dashboard");
            break;
          case "manager":
            toast.success("Welcome to manager panel");
            navigate("/manager-panel/manager-dashboard");
            break;
          case "staff":
            toast.success("Welcome to staff panel");
            navigate("/staff-panel/staff-dashboard");
            break;
          case "cashier":
            toast.success("Welcome to cashier panel");
            navigate("/cashier-panel/cashier-dashboard");
            break;
          case "customer":
            toast.success("Welcome to user panel");
            navigate("/");
            break;
          default:
            toast.error("Invalid role");
        }
      } else {
        const errorMessage = response.message || "Wrong credentials!";
        toast.error(errorMessage, { position: "top-center" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#f8f1e5] to-[#efe0cc]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-[#4e342e] mb-2">Welcome Back</h1>
              <p className="text-[#795548]">Sign in to continue your coffee journey</p>
            </motion.div>

            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5" 
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#8d6e63]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={handleOnChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#bcaaa4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41] transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-[#5d4037] font-medium mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#8d6e63]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={handleOnChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#bcaaa4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-[#6d4c41] transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Forgot Password */}
              <motion.div variants={itemVariants} className="text-right">
                <a href="#" className="text-sm text-[#6d4c41] hover:text-[#4e342e] transition-colors duration-200">
                  Forgot password?
                </a>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#6d4c41] to-[#4e342e] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-[#795548] text-sm"
            >
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/sign-up")}
                className="text-[#6d4c41] hover:text-[#4e342e] font-medium cursor-pointer transition-colors duration-200"
              >
                Sign Up
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] text-white p-10 flex flex-col justify-center items-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 text-9xl">☕</div>
            <div className="absolute bottom-1/3 right-1/4 text-8xl">🌱</div>
            <div className="absolute top-1/3 right-1/3 text-7xl">🍂</div>
          </div>
          
          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold mb-6"
            >
              Espresso Echo
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl mb-8 text-amber-100 max-w-md mx-auto"
            >
              Discover the perfect blend of flavor and community
            </motion.p>
            
            {/* Animated Coffee Illustration */}
            <motion.div 
              className="relative mt-12 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {/* Coffee Cup */}
              <div className="relative w-64 h-56 mx-auto">
                {/* Cup */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-40 bg-[#3e2723] rounded-b-full rounded-t-lg"></div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-[#795548] rounded-b-full rounded-t-lg"></div>
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-28 bg-[#6d4c41] rounded-b-full rounded-t-lg"></div>
                
                {/* Handle */}
                <div className="absolute bottom-20 right-16 w-12 h-8 border-8 border-[#3e2723] rounded-r-full"></div>
                
                {/* Coffee */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-44 h-24 bg-[#4e342e] rounded-b-full rounded-t-lg"></div>
                
                {/* Steam */}
                <motion.div
                  variants={coffeeSteamVariants}
                  animate="animate"
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-12 h-16 rounded-full bg-white/30"
                />
                <motion.div
                  variants={coffeeSteamVariants}
                  animate="animate"
                  transition={{ delay: 0.5 }}
                  className="absolute -top-14 left-1/3 transform -translate-x-1/2 w-10 h-14 rounded-full bg-white/40"
                />
                <motion.div
                  variants={coffeeSteamVariants}
                  animate="animate"
                  transition={{ delay: 1 }}
                  className="absolute -top-12 right-1/3 transform -translate-x-1/2 w-8 h-12 rounded-full bg-white/20"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Premium coffee blends</p>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Fast delivery service</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-3">
                  <span className="text-[#4e342e] font-bold">✓</span>
                </div>
                <p className="text-amber-100">Exclusive member rewards</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;