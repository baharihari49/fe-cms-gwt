// components/faq-category/faq-category-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FolderOpen } from "lucide-react"
import { FAQCategory } from "./types/faq-category"
import * as Icons from "lucide-react"

interface FAQCategoryViewDialogProps {
  category: FAQCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FAQCategoryViewDialog({ category, open, onOpenChange }: FAQCategoryViewDialogProps) {
  if (!category) return null

  const IconComponent = Icons[category.icon as keyof typeof Icons] as any

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            FAQ Category Details
          </DialogTitle>
          <DialogDescription>
            View FAQ category information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Category Name</h4>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                {IconComponent && <IconComponent className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category.count} FAQ{category.count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Category ID</h4>
            <Badge variant="outline">{category.id}</Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Icon</h4>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                {IconComponent && <IconComponent className="h-4 w-4" />}
              </div>
              <Badge variant="secondary" className="font-mono">{category.icon}</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">FAQ Count</h4>
            <Badge variant={category.count > 0 ? "default" : "secondary"}>
              {category.count} FAQ{category.count !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}