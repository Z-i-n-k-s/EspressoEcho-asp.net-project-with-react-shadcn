import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { sidebarMenus } from "../sidebar-menu/sidebarMenus";
import SidebarItem from "../sidebar-items/SidebarItem";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const menu = sidebarMenus[role] || [];

  return (
    <TooltipProvider delayDuration={100}>
      <motion.div
        initial={{ width: collapsed ? 64 : 240 }}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-secondary text-secondary-foreground shadow-md flex flex-col"
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

          <div className="space-y-1">
            {menu.map((item, idx) => (
              <SidebarItem key={idx} {...item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Sidebar;
