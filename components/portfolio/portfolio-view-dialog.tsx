// components/projects/project-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ExternalLink, 
  Github, 
  FileText, 
  PlayCircle, 
  Calendar,
  User,
  Timer,
  BarChart3,
  TrendingUp,
  Star,
  Download,
  DollarSign,
  Activity
} from "lucide-react"
import { Project, ProjectStatus } from "@/components/portfolio/types"
import { format } from "date-fns"

interface ProjectViewDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const variants = {
    [ProjectStatus.DEVELOPMENT]: { variant: 'secondary' as const, color: 'text-yellow-600' },
    [ProjectStatus.BETA]: { variant: 'outline' as const, color: 'text-blue-600' },
    [ProjectStatus.LIVE]: { variant: 'default' as const, color: 'text-green-600' },
    [ProjectStatus.ARCHIVED]: { variant: 'destructive' as const, color: 'text-red-600' },
    [ProjectStatus.MAINTENANCE]: { variant: 'secondary' as const, color: 'text-orange-600' },
  }

  const config = variants[status] || variants[ProjectStatus.DEVELOPMENT]

  return (
    <Badge variant={config.variant} className={config.color}>
      {status}
    </Badge>
  )
}

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType
  label: string
  value?: string 
}) => {
  if (!value) return null

  return (
    <Card>
      <CardContent className="flex items-center p-4">
        <Icon className="h-8 w-8 text-muted-foreground mr-3" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectViewDialog({ project, open, onOpenChange }: ProjectViewDialogProps) {
  if (!project) return null

  const openLink = (url?: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-lg mt-2">
                {project.subtitle}
              </DialogDescription>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{project.year || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{project.client || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{project.duration || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{project.category.label}</Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {project.metrics && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard icon={User} label="Users" value={project.metrics.users} />
                <MetricCard icon={TrendingUp} label="Performance" value={project.metrics.performance} />
                <MetricCard icon={Star} label="Rating" value={project.metrics.rating} />
                <MetricCard icon={Download} label="Downloads" value={project.metrics.downloads} />
                <MetricCard icon={DollarSign} label="Revenue" value={project.metrics.revenue} />
                <MetricCard icon={Activity} label="Uptime" value={project.metrics.uptime} />
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.links.live && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => openLink(project.links?.live)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Site
                  </Button>
                )}
                {project.links.github && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => openLink(project.links?.github)}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                )}
                {project.links.demo && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => openLink(project.links?.demo)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Demo
                  </Button>
                )}
                {project.links.case && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => openLink(project.links?.case)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Case Study
                  </Button>
                )}
                {project.links.docs && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => openLink(project.links?.docs)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Created: {format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
              <span>Updated: {format(new Date(project.updatedAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}