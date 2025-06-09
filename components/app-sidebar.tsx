"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Users,
  Settings,
  Layers,
  Folder,
  UserCircle2,
  HelpCircle,
  Code, // ← imported for Technology
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import Image from "next/image"
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
    },
    {
      title: "Posts",
      url: "/posts",
      icon: FileText,
      items: [
        { title: "All Posts", url: "/blog/posts" },
        { title: "Add New", url: "/blog/posts/new" },
        { title: "Categories", url: "/blog/categories" },
        { title: "Tags", url: "/blog/tags" },
      ],
    },
    // {
    //   title: "Media",
    //   url: "/media",
    //   icon: ImageIcon,
    //   items: [
    //     { title: "Library", url: "/media" },
    //     { title: "Add New", url: "/media/upload" },
    //   ],
    // },
    // {
    //   title: "Users",
    //   url: "/users",
    //   icon: Users,
    //   items: [
    //     { title: "All Users", url: "/users" },
    //     { title: "Add New", url: "/users/new" },
    //     { title: "Your Profile", url: "/profile" },
    //   ],
    // },
    // {
    //   title: "Vendor",
    //   url: "/vendors",
    //   icon: Folder,
    //   items: [
    //     { title: "List Vendor", url: "/vendors" },
    //     { title: "Add New Vendor", url: "/vendors/new" },
    //   ],
    // },
    {
      title: "Client",
      url: "/clients",
      icon: UserCircle2,
      items: [
        { title: "List Clients", url: "/clients" },
        { title: "Testimonial", url: "/testimonial" },
      ],
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: Layers,
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: HelpCircle,
    },
    {
      title: "Technology",    // ← new entry
      url: "/technology",
      icon: Code,
      items: [],             // ← zero items
    },
    {
      title: "Services",     // ← added Services entry
      url: "/services",
      icon: Layers,           // choose an icon, e.g., Layers
      items: [],             // zero items
    },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    //   items: [
    //     { title: "General", url: "/settings/general" },
    //     { title: "Appearance", url: "/settings/appearance" },
    //     { title: "Permissions", url: "/settings/permissions" },
    //   ],
    // },
  ],

  projects: [
    // {
    //   name: "Blog Management",
    //   url: "/projects/blog",
    //   icon: FileText,
    // },
    // {
    //   name: "Media Organizer",
    //   url: "/projects/media",
    //   icon: ImageIcon,
    // },
    // {
    //   name: "User Directory",
    //   url: "/projects/users",
    //   icon: UserCircle2,
    // },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="https://res.cloudinary.com/du0tz73ma/image/upload/c_crop,h_2190,w_4321/v1748670695/gwt-projects/LOGO_GWT_9_pye1l5.png"
          alt="CMS Logo"
          width={100}
          height={100}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
