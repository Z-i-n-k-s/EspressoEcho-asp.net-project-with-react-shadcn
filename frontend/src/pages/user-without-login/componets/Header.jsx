import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../../../assets/Logo.png"; 
import ThemeChange from "../../../theme/ThemeChange";
import ResponsiveMenu from "./ResponsiveMenu"; 

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  // helper to check if path is active
  const isActive = (path) => location.pathname === path;

  return (
   <header className="bg-[#4e342e] px-4 md:px-0 fixed z-50 w-full top-0 shadow-md ">
  <div className="max-w-7xl mx-auto flex justify-between items-center py-5">
        {/* Logo + Brand */}
        <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
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
            <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter]  ${
                isActive("/sign-up") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/sign-up")}
            >
             Sign Up
            </li>
               <li
              className={`cursor-pointer hover:text-amber-400 font-[Inter]  ${
                isActive("/cart") ? "text-yellow-400" : ""
              }`}
              onClick={() => navigate("/cart")}
            >
             Cart
            </li>
          </ul>

  
        </nav>

        {/* Mobile Menu Icon */}
        {open ? (
          <X onClick={() => setOpen(false)} className="text-white w-7 h-7 md:hidden" />
        ) : (
          <Menu onClick={() => setOpen(true)} className="text-white w-7 h-7 md:hidden" />
        )}
      </div>

      {/* Mobile Nav */}
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </header>
  );
};

export default Header;
