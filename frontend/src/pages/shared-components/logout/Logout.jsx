import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Remove auth token or user info from localStorage/sessionStorage
    localStorage.removeItem("authToken"); // example token
    localStorage.removeItem("user"); // optional: user info

    // 2. Optionally, you can also reset any context/redux state here

    // 3. Redirect to home page
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
      Logging out...
    </div>
  );
};

export default Logout;
