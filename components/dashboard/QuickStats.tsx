'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface QuickStatsProps {
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
}

export function QuickStats({ projectStats, clientStats }: QuickStatsProps) {
  const completionRate = (projectStats.completedProjects / projectStats.totalProjects) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Progress</CardTitle>
          <CardDescription>Overall completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold">{projectStats.completedProjects}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{projectStats.inProgressProjects}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Client Metrics</CardTitle>
          <CardDescription>Client satisfaction overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Rating</span>
              <Badge variant="secondary">
                ⭐ {clientStats.averageRating.toFixed(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{clientStats.totalClients}</div>
                <div className="text-xs text-muted-foreground">Total Clients</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{clientStats.activeClients}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}