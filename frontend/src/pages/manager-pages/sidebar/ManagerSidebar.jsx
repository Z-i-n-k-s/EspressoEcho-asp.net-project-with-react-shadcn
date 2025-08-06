import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  LayoutDashboard,
  Package,
  Shuffle,
  ClipboardList,
  Users,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { TooltipProvider } from '@/components/ui/tooltip';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/manager-panel/manager-dashboard' },
  { icon: Package, label: 'Inventory Management', path: '/manager-panel/inventory' },
  { icon: Shuffle, label: 'Inventory Transfer', path: '/manager-panel/transfer' },
  { icon: ClipboardList, label: 'Reports', path: '/manager-panel/reports' },
  { icon: Users, label: 'Employee Performance', path: '/manager-panel/employees' },
  { icon: MessageSquare, label: 'Customer Feedback', path: '/manager-panel/feedback' },
  { icon: LogOut, label: 'Logout', path: '/logout' },
];

const ManagerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={`h-screen bg-secondary text-secondary-foreground shadow-md ${
          collapsed ? 'w-16' : 'w-60'
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
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ManagerSidebar;
