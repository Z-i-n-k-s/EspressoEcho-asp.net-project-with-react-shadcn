import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

function ThemeChange() {
  const { theme, setTheme } = useTheme();
  const themes = ["light", "dark", "system"];

  const handleThemeChange = () => {
    const newTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(newTheme);
  };
  return (
    <span className="bg-popover text-popover-foreground w-fit rounded-full flex justify-center items-center m-2 p-2">
      <button onClick={handleThemeChange}>
        {theme === "dark" && (
          <h1>
            <Moon></Moon>
          </h1>
        )}
        {theme === "light" && (
          <h1>
            <Sun></Sun>
          </h1>
        )}
        {theme === "system" && (
          <h1>
            <MonitorSmartphone></MonitorSmartphone>
          </h1>
        )}
      </button>
    </span>
  );
}

export default ThemeChange;