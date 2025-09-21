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

          // Redirect to landing page after successful logout
          navigate("/", { replace: true });
        } else {
          toast.error(response?.message || "Logout failed!", { position: "top-center" });
          // Still redirect to landing page even if API call fails
          navigate("/", { replace: true });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        toast.error(errorMessage, { position: "top-center" });
        // Redirect to landing page on error
        navigate("/", { replace: true });
      } finally {
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [dispatch, navigate, isLoggingOut]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-amber-50 via-[#f8f1e5] to-[#efe0cc]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d4c41] mx-auto mb-4"></div>
        <p className="text-[#5d4037] font-medium">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;