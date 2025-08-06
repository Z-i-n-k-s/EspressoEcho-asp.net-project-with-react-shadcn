import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SidebarItem = ({ icon: Icon, label, path, collapsed }) => {
  if (collapsed) {
    // Tooltip active ONLY when sidebar is collapsed
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted rounded-md transition-all justify-center'
            )}
          >
            <Icon className="w-5 h-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="px-2 py-1 text-sm">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Normal item (no tooltip) when expanded
  return (
    <Link
      to={path}
      className={cn(
        'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted rounded-md transition-all justify-start'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default SidebarItem;
