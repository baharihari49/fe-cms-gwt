// components/blog/tags/tag-form-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tag, CreateTagRequest, UpdateTagRequest } from "./types/tags"
import { Hash } from "lucide-react"

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
})

type TagFormData = z.infer<typeof tagSchema>

interface TagFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag?: Tag | null
  onSubmit: (data: CreateTagRequest | UpdateTagRequest) => Promise<void>
  loading?: boolean
}

export function TagFormDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
  loading = false,
}: TagFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TagFormData, string>>>({})
  
  const isEditing = Boolean(tag)

  // Reset form when dialog opens/closes or tag changes
  useEffect(() => {
    if (open) {
      if (tag) {
        setFormData({
          name: tag.name,
        })
      } else {
        setFormData({
          name: "",
        })
      }
      setErrors({})
    }
  }, [open, tag])

  const validateForm = (): boolean => {
    const result = tagSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof TagFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof TagFormData
        newErrors[path] = issue.message
      })
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
      if (!isEditing) {
        setFormData({
          name: "",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Generate slug preview
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const slugPreview = generateSlug(formData.name)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Tag" : "Create New Tag"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter tag name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug Preview */}
          {formData.name && (
            <div className="space-y-2">
              <Label>Slug Preview</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">
                  {slugPreview || "tag-slug"}
                </span>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{formData.name || "Tag Name"}</div>
                <div className="text-sm text-muted-foreground">
                  #{slugPreview || "tag-slug"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}