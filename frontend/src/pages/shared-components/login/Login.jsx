// Login.js
import apiClient from "@/api/ApiCilent";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '@/store/userSlice';

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
            navigate("/user-panel/buy-now");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-cyan-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <i className="fas fa-user text-gray-400 mr-3"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleOnChange}
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
              value={data.password}
              onChange={handleOnChange}
              className="bg-transparent flex-1 outline-none py-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;