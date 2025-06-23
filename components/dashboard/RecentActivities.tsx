'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  FolderOpen, 
  FileText, 
  Users, 
  MessageSquare,
  Clock
} from 'lucide-react'

// ✅ Fix interface - timestamp should be string
interface Activity {
  id: string
  type: 'project' | 'blog' | 'client' | 'testimonial'
  title: string
  description: string
  timestamp: string // ✅ Changed from Date to string
  status?: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'project': return <FolderOpen className="h-4 w-4" />
    case 'blog': return <FileText className="h-4 w-4" />
    case 'client': return <Users className="h-4 w-4" />
    case 'testimonial': return <MessageSquare className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'project': return 'bg-blue-500'
    case 'blog': return 'bg-green-500' 
    case 'client': return 'bg-purple-500'
    case 'testimonial': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Recent Activities
        </CardTitle>
        <CardDescription className="text-sm">
          Latest updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activities
            </p>
          ) : (
            activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className={`h-6 w-6 ${getActivityColor(activity.type)}`}>
                  <AvatarFallback className="text-white text-xs">
                    {getActivityIcon(activity.type)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium leading-none truncate">
                      {activity.title}
                    </p>
                    {activity.status && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-5 shrink-0">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {/* ✅ Parse string to Date for formatting */}
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* View All Button */}
        {activities.length > 6 && (
          <div className="pt-3 border-t mt-3">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}