import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export default function NavUserSkeleton() {
  return (
    <SidebarMenuButton size="lg">
      <Skeleton className="h-8 w-8 "></Skeleton>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <Skeleton className="truncate font-medium w-4 h-2"></Skeleton>
        <Skeleton className="truncate text-xs w-8 h-2"></Skeleton>
      </div>
    </SidebarMenuButton>
  );
}
