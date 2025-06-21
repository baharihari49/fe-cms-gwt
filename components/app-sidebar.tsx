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
  TableOfContents,
  Phone
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
import { useAuth } from "@/hooks/useAuth"

const staticData = {
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
        { title: "Author", url: "/blog/author" }
      ],
    },
    {
      title: "Teams",
      url: "/team",
      icon: Users,
    },
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
      items: [
        { title: "List FAQ", url: '/faq' },
        { title: "Category", url: "/faq/categories" }
      ]
    },
    {
      title: "Technology",
      url: "/technology",
      icon: Code,
      items: [],
    },
    {
      title: "Services",
      url: "/services",
      icon: Layers,
      items: [],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Phone,
      items: [],
    },
    {
      title: "Contents",
      url: "#",
      icon: TableOfContents,
      items: [
        { title: "About Us", url: "/about" },
        { title: "Hero", url: "/hero" }
      ],
    },
  ],

  projects: [
    // Projects data if needed
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = React.useState(false)

  // Ensure component is hydrated
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Transform user data dari useAuth untuk NavUser component
  const userData = React.useMemo(() => {
    if (!user) {
      return {
        name: "Guest User",
        email: "guest@example.com",
        avatar: "/avatars/default.jpg", // default avatar
      }
    }

    return {
      name: user.name || user.email, // fallback ke email jika name null
      email: user.email,
      avatar: "/avatars/admin.jpg", // atau bisa dari user.avatar jika ada field avatar
    }
  }, [user])

  // Prevent hydration mismatch by showing consistent UI until client-side
  if (!isClient) {
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
          <NavMain items={staticData.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  // Show loading state only on client-side if auth is still loading
  if (loading) {
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
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

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
        <NavMain items={staticData.navMain} />
        {/* <NavProjects projects={staticData.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}