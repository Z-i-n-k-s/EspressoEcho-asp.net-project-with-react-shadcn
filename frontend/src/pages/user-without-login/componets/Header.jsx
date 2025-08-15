import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "../../../assets/Logo.png";
import ResponsiveMenu from "./ResponsiveMenu";

const Header = () => {
  const [open, setOpen] = useState(false); // mobile menu
  const [servicesOpen, setServicesOpen] = useState(false); // dropdown
  const [isLoggedIn, setIsLoggedIn] = useState(true); // change based on auth status

  const navigate = useNavigate();
  const location = useLocation();

  // Corrected isActive logic
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/user-panel") return location.pathname === "/user-panel"; // only exact
    return location.pathname === path; // other exact matches
  };

  const handleLogout = () => {
    // remove auth token or user data from storage
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-[#4e342e] px-4 md:px-0 fixed z-50 w-full top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5">
        {/* Logo + Brand */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer"
        >
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl text-white font-inter ml-2">Espresso Echo</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="md:flex hidden items-center gap-6">
          <ul className="flex gap-7 items-center text-lg font-medium text-white">
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                isActive("/") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                isActive("/menu-user") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/menu-user")}
            >
              Menu
            </li>
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                isActive("/about-us") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/about-us")}
            >
              About
            </li>
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                isActive("/branches") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/branches")}
            >
              Branches
            </li>

            {/* Cart Icon */}
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                isActive("/user-panel/cart") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/user-panel/cart")}
            >
              🛒
            </li>

            {/* If NOT logged in → show Sign Up */}
            {!isLoggedIn && (
              <li
                className={`cursor-pointer hover:text-amber-400 font-[Inter] ${
                  isActive("/sign-up") ? "text-yellow-400" : ""
                }`}
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </li>
            )}

            {/* If logged in → show Services + Logout */}
            {isLoggedIn && (
              <>
                {/* Services Dropdown */}
                <li className="relative">
                  <button
                    onClick={() => setServicesOpen((prev) => !prev)}
                    className={`flex items-center gap-1 font-[Inter] hover:text-amber-400 ${
                      isActive("/user-panel") ? "text-yellow-400" : ""
                    }`}
                  >
                    Services <ChevronDown size={16} />
                  </button>
                  {servicesOpen && (
                    <ul className="absolute top-full left-0 mt-2 w-40 bg-[#e5c185] text-black rounded shadow-lg">
                      <li
                        className={`px-4 py-2 cursor-pointer hover:bg-[#3e2723] hover:text-white ${
                          isActive("/user-panel/offers")
                            ? "bg-[#3e2723] text-white"
                            : ""
                        }`}
                        onClick={() => navigate("/user-panel/offers")}
                      >
                        Offers
                      </li>
                      <li
                        className={`px-4 py-2 cursor-pointer hover:bg-[#3e2723] hover:text-white ${
                          isActive("/history") ? "bg-[#3e2723] text-white" : ""
                        }`}
                        onClick={() => navigate("/history")}
                      >
                        History
                      </li>
                      <li
                        className={`px-4 py-2 cursor-pointer hover:bg-[#3e2723] hover:text-white ${
                          isActive("/orders") ? "bg-[#3e2723] text-white" : ""
                        }`}
                        onClick={() => navigate("/orders")}
                      >
                        My Orders
                      </li>
                    </ul>
                  )}
                </li>

                {/* Logout */}
                <li
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-red-400 font-[Inter]"
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        {open ? (
          <X
            onClick={() => setOpen(false)}
            className="text-white w-7 h-7 md:hidden"
          />
        ) : (
          <Menu
            onClick={() => setOpen(true)}
            className="text-white w-7 h-7 md:hidden"
          />
        )}
      </div>

      {/* Mobile Nav */}
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </header>
  );
};

export default Header;
