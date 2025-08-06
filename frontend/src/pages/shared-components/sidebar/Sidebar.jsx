import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { sidebarMenus } from "../sidebar-menu/sidebarMenus";
import SidebarItem from "../sidebar-items/SidebarItem";


const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const menu = sidebarMenus[role] || [];

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={`h-screen bg-secondary text-secondary-foreground shadow-md ${
          collapsed ? "w-16" : "w-60"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="mb-4"
          >
            <Menu />
          </Button>
          <div className="space-y-2">
            {menu.map((item, idx) => (
              <SidebarItem key={idx} {...item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
