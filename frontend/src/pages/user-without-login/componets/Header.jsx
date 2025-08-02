import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeChange from "../../../theme/ThemeChange";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold text-primary cursor-pointer"
        >
          MyApp
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex space-x-6 text-foreground font-medium">
          <li>
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary transition"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/about-us")}
              className="hover:text-primary transition"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/services")}
              className="hover:text-primary transition"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/contact")}
              className="hover:text-primary transition"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Theme Toggle */}
        <ThemeChange />
      </nav>
    </header>
  );
};

export default Header;
