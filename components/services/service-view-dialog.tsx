// components/services/service-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Service } from "@/components/services/types/services"
import { format } from "date-fns"
import * as LucideIcons from "lucide-react"

interface ServiceViewDialogProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceViewDialog({ service, open, onOpenChange }: ServiceViewDialogProps) {
  if (!service) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${service.color}`}>
              {(() => {
                const IconComponent = (LucideIcons as any)[service.icon]
                return IconComponent ? (
                  <IconComponent className="h-6 w-6 text-white" />
                ) : (
                  <span className="text-2xl">{service.icon}</span>
                )
              })()}
            </div>
            <div>
              <div className="font-semibold">{service.title}</div>
              <div className="text-sm text-muted-foreground">{service.subtitle}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Service Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">{service.description}</p>
            </div>
          </div>

          {/* Color Preview */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Color</h4>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${service.color}`} />
              <code className="text-xs bg-muted px-2 py-1 rounded">{service.color}</code>
            </div>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <Badge key={feature.id} variant="secondary">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {service.technologies && service.technologies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <Badge key={tech.id} variant="outline" className="flex items-center gap-1">
                    {tech.technology?.icon && <span>{tech.technology.icon}</span>}
                    {tech.technology?.name || 'Unknown'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">ID:</span> #{service.id}
              </div>
              <div>
                <span className="font-medium">Created:</span> {format(new Date(service.createdAt), "MMM dd, yyyy")}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {format(new Date(service.updatedAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}