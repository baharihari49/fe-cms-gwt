// components/technologies/technology-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Technology } from "./types/technology"

interface TechnologyViewDialogProps {
  technology: Technology | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TechnologyViewDialog({ technology, open, onOpenChange }: TechnologyViewDialogProps) {
  if (!technology) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {technology.icon && (
              <span className="text-lg">{technology.icon}</span>
            )}
            {technology.name}
          </DialogTitle>
          <DialogDescription>
            Technology Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
            <p className="text-sm">{technology.name}</p>
          </div>

          {technology.icon && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Icon</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg">{technology.icon}</span>
                <Badge variant="secondary">{technology.icon}</Badge>
              </div>
            </div>
          )}

          {technology.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{technology.description}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
            <Badge variant="outline">#{technology.id}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}