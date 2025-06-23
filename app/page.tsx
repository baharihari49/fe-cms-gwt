'use client'
import { useEffect, useState } from 'react'
import { KPICards } from '@/components/dashboard/KPICards'
import { ProjectStatusChart } from '@/components/dashboard/charts/ProjectStatusChart'
import { TechnologyUsageChart } from '@/components/dashboard/charts/TechnologyUsageChart'
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  FolderOpen,
  FileText,
  Users,
  Wrench,
  Activity
} from 'lucide-react'
import { RecentActivities } from '@/components/dashboard/RecentActivities'
import { QuickStats } from '@/components/dashboard/QuickStats'

// ✅ Define proper types
interface DashboardData {
  totalProjects: number
  totalBlogPosts: number
  totalClients: number
  projectsByStatus: Array<{
    status: string
    _count: { status: number }
  }>
  technologyUsage: Array<{
    name: string
    count: number
  }>
  projectStats: {
    totalProjects: number
    completedProjects: number
    inProgressProjects: number
  }
  clientStats: {
    totalClients: number
    activeClients: number
    averageRating: number
  }
  recentActivities: Array<{
    id: string
    type: 'project' | 'blog' | 'client' | 'testimonial'
    title: string
    description: string
    timestamp: string
    status?: string
  }>
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/stats`)
      const result = await response.json()
      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-80 col-span-4" />
          <Skeleton className="h-80 col-span-3" />
        </div>
      </div>
    )
  }

  // ✅ Add null check and provide defaults
  if (!dashboardData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  const kpiData = [
    {
      title: 'Total Projects',
      value: dashboardData.totalProjects || 0,
      trend: { value: 12, isPositive: true },
      icon: <FolderOpen className="h-4 w-4" />,
      description: 'Active and completed projects'
    },
    {
      title: 'Published Posts',
      value: dashboardData.totalBlogPosts || 0,
      trend: { value: 8, isPositive: true },
      icon: <FileText className="h-4 w-4" />,
      description: 'Live blog articles'
    },
    {
      title: 'Active Clients',
      value: dashboardData.totalClients || 0,
      trend: { value: 5, isPositive: true },
      icon: <Users className="h-4 w-4" />,
      description: 'Current client partnerships'
    },
    {
      title: 'Technologies',
      value: dashboardData.technologyUsage?.length || 0,
      icon: <Wrench className="h-4 w-4" />,
      description: 'Tech stack in use'
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Live data</span>
        </div>
      </div>
      <Separator />

      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Main Charts - Full Width Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {dashboardData.projectsByStatus && dashboardData.projectsByStatus.length > 0 && (
            <ProjectStatusChart data={dashboardData.projectsByStatus} />
          )}
        </div>
        <div>
          {dashboardData.technologyUsage && dashboardData.technologyUsage.length > 0 && (
            <TechnologyUsageChart data={dashboardData.technologyUsage} />
          )}
        </div>
      </div>

      {/* QuickStats + Recent Activities - Better Proportion */}
      <div className="grid gap-4 grid-cols-1">
        <div>
          {dashboardData.projectStats && dashboardData.clientStats && (
            <QuickStats
              projectStats={dashboardData.projectStats}
              clientStats={dashboardData.clientStats}
            />
          )}
        </div>
        <div>
          {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
            <RecentActivities activities={dashboardData.recentActivities} />
          )}
        </div>
      </div>
    </div>
  )
}