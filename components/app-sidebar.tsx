"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  Layers,
  Folder,
  UserCircle2,
  HelpCircle,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin CMS",
    email: "admin@cms.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "CMS Global",
      logo: Layers,
      plan: "Pro",
    },
    {
      name: "Content Team",
      logo: Folder,
      plan: "Basic",
    },
  ],
navMain: [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [],
  },
  {
    title: "Posts",
    url: "/posts",
    icon: FileText,
    items: [
      { title: "All Posts", url: "/blog/posts" },
      { title: "Add New", url: "/posts/new" },
      { title: "Categories", url: "/categories" },
      { title: "Tags", url: "/tags" },
    ],
  },
  {
    title: "Media",
    url: "/media",
    icon: Image,
    items: [
      { title: "Library", url: "/media" },
      { title: "Add New", url: "/media/upload" },
    ],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    items: [
      { title: "All Users", url: "/users" },
      { title: "Add New", url: "/users/new" },
      { title: "Your Profile", url: "/profile" },
    ],
  },
  {
    title: "Vendor",
    url: "/vendors",
    icon: Folder,
    items: [
      { title: "List Vendor", url: "/vendors" },
      { title: "Add New Vendor", url: "/vendors/new" },
    ],
  },
  {
    title: "Client",
    url: "/clients",
    icon: UserCircle2,
    items: [
      { title: "List Client", url: "/clients" },
      { title: "Add New Client", url: "/clients/new" },
    ],
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: Layers,
    items: [
      { title: "All Projects", url: "/portfolio" },
      { title: "Add New", url: "/portfolio/new" },
    ],
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: HelpCircle,
    items: [
      { title: "All Questions", url: "/faq" },
      { title: "Add FAQ", url: "/faq/new" },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    items: [
      { title: "General", url: "/settings/general" },
      { title: "Appearance", url: "/settings/appearance" },
      { title: "Permissions", url: "/settings/permissions" },
    ],
  },
],

  projects: [
    {
      name: "Blog Management",
      url: "/projects/blog",
      icon: FileText,
    },
    {
      name: "Media Organizer",
      url: "/projects/media",
      icon: Image,
    },
    {
      name: "User Directory",
      url: "/projects/users",
      icon: UserCircle2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
