// Logout.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/ApiCilent";
import { toast } from "react-toastify";

const Logout = () => {
  console.log("log out res")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      if (isLoggingOut) return; // prevent double calls
      setIsLoggingOut(true);

      try {
        // Call API logout
        const response = await apiClient.logout();
        console.log("log out res",response)

        if (response?.success) {
          // Clear Redux + tokens
          dispatch(clearUser());
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          toast.success("Logged out successfully", { position: "top-center" });

          navigate("/"); // redirect
        } else {
          toast.error(response?.message || "Logout failed!", { position: "top-center" });
         // navigate("/"); // still redirect
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        toast.error(errorMessage, { position: "top-center" });
       // navigate("/");
      }
    };

    handleLogout();
  }, [dispatch, navigate, isLoggingOut]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
