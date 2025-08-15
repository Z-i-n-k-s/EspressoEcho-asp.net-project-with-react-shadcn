import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const SidebarItem = ({ icon: Icon, label, path, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  const baseClasses =
    "flex items-center gap-3 p-3 cursor-pointer rounded-md transition-all";
  const activeClasses =
    "bg-amber-200 text-amber-900 shadow-sm"; // active = light coffee
  const hoverClasses =
    "hover:bg-amber-100 hover:text-amber-900"; // hover = light coffee

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={path}
              className={cn(
                baseClasses,
                "justify-center",
                isActive ? activeClasses : hoverClasses
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="!bg-amber-200 !text-amber-900 px-2 py-1 text-sm rounded-md shadow-md border-none"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      to={path}
      className={cn(
        baseClasses,
        "justify-start",
        isActive ? activeClasses : hoverClasses
      )}
    >
      <Icon className="w-5 h-5" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default SidebarItem;
