"use client";
import React from "react";
import { Home, Inbox, Settings, type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/session";
import UserInfo from "./user";

type Item = {
  title: string;
  url: string;
  icon: LucideIcon;
  authRequired: boolean;
  adminRequired: boolean;
};

const groups: {
  label: string;
  items: Item[];
}[] = [
  {
    label: "Home",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        authRequired: false,
        adminRequired: false,
      },
      {
        title: "My Tickets",
        url: "/tickets",
        icon: Inbox,
        authRequired: true,
        adminRequired: false,
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Manage Tickets",
        url: "/admin/tickets",
        icon: Settings,
        authRequired: true,
        adminRequired: true,
      },
      {
        title: "Add Movie",
        url: "/admin/movie/add",
        icon: Settings,
        authRequired: true,
        adminRequired: true,
      },
      {
        title: "Add Screen",
        url: "/admin/screen/add",
        icon: Settings,
        authRequired: true,
        adminRequired: true,
      },
    ],
  },
];

const AppSidebar = () => {
  const { user } = useSession();
  const { setOpenMobile } = useSidebar();

  const isAuthed = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {groups.map((group) => {
          // filter out items user shouldn't see
          const visible = group.items.filter((item) => {
            if (item.adminRequired) return isAdmin;
            if (item.authRequired) return isAuthed;
            return true;
          });

          if (visible.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visible.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                          className="flex items-center"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
