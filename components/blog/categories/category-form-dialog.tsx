// components/blog/categories/category-form-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "./types/categories"
import { 
  Code, 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Cloud,
  Link, 
  Palette, 
  Database, 
  Brain, 
  Settings, 
  Zap,
  Monitor, 
  Server, 
  Terminal, 
  Layers, 
  Package, 
  Rocket, 
  Target, 
  Award, 
  BookOpen, 
  FileText, 
  Lightbulb,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>
  loading?: boolean
}

// Icon mapping - menggunakan object dengan key yang konsisten
const iconMap = {
  Code, 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Cloud,
  Link, 
  Palette, 
  Database, 
  Brain, 
  Settings, 
  Zap,
  Monitor, 
  Server, 
  Terminal, 
  Layers, 
  Package,
  Rocket, 
  Target, 
  Award, 
  BookOpen, 
  FileText, 
  Lightbulb
}

// Available icons for selection - menggunakan array string yang konsisten
const AVAILABLE_ICONS = [
  "Code",
  "Globe", 
  "Smartphone", 
  "TrendingUp", 
  "Shield", 
  "Cloud",
  "Link", 
  "Palette", 
  "Database", 
  "Brain", 
  "Settings", 
  "Zap",
  "Monitor", 
  "Server", 
  "Terminal", 
  "Layers", 
  "Package",
  "Rocket", 
  "Target", 
  "Award", 
  "BookOpen", 
  "FileText", 
  "Lightbulb"
] as const

// Available gradient color combinations
const AVAILABLE_COLORS = [
  { name: "Blue to Cyan", value: "from-blue-500 to-cyan-400" },
  { name: "Green to Emerald", value: "from-green-500 to-emerald-400" },
  { name: "Purple to Pink", value: "from-purple-500 to-pink-400" },
  { name: "Red to Pink", value: "from-red-500 to-pink-400" },
  { name: "Orange to Red", value: "from-orange-500 to-red-400" },
  { name: "Yellow to Orange", value: "from-yellow-500 to-orange-400" },
  { name: "Sky to Blue", value: "from-sky-500 to-blue-400" },
  { name: "Indigo to Purple", value: "from-indigo-500 to-purple-400" },
  { name: "Violet to Purple", value: "from-violet-500 to-purple-400" },
  { name: "Pink to Rose", value: "from-pink-500 to-rose-400" },
] as const

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  loading = false,
}: CategoryFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    icon: "Code",
    color: "from-blue-500 to-cyan-400",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})
  
  const isEditing = Boolean(category)

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
        })
      } else {
        setFormData({
          name: "",
          description: "",
          icon: "Code",
          color: "from-blue-500 to-cyan-400",
        })
      }
      setErrors({})
    }
  }, [open, category])

  const validateForm = (): boolean => {
    const result = categorySchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof CategoryFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CategoryFormData
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
          description: "",
          icon: "Code",
          color: "from-blue-500 to-cyan-400",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Mengakses icon component dengan cara yang benar
  const IconComponent = iconMap[formData.icon as keyof typeof iconMap]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description"
              className="resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Icon Field */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select 
                value={formData.icon} 
                onValueChange={(value) => handleInputChange("icon", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon">
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {formData.icon}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map((iconName) => {
                    const Icon = iconMap[iconName as keyof typeof iconMap]
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {iconName}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.icon && (
                <p className="text-sm text-destructive">{errors.icon}</p>
              )}
            </div>

            {/* Color Field */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select 
                value={formData.color} 
                onValueChange={(value) => handleInputChange("color", value)}
              >
                <SelectTrigger className="w-full"> 
                  <SelectValue placeholder="Select a color">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${formData.color}`} />
                      {AVAILABLE_COLORS.find(c => c.value === formData.color)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.value}`} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${formData.color} text-white`}>
                {IconComponent && <IconComponent className="h-4 w-4" />}
              </div>
              <div>
                <div className="font-medium">{formData.name || "Category Name"}</div>
                <div className="text-sm text-muted-foreground">
                  {formData.description || "Category description"}
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