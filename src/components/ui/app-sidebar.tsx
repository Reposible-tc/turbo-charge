import * as React from "react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavUserDetails from "./nav-user-details";
import ApplicationIcon from "./application-icon";
import { APPLICATION_NAME } from "@/utils/constants";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href={"/"}>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <ApplicationIcon />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{APPLICATION_NAME}</span>
              <span className="truncate text-xs">Turbo Charge</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser>
          <NavUserDetails />
        </NavUser>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
