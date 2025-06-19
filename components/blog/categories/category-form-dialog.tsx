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
import IconPicker from "@/lib/utils/IconPicker"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "./types/categories"
import { GradientColorFormField } from "@/components/GradientColorFormField"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { gradientColorOptions } from "@/lib/config/gradientColors"

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

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  loading = false,
}: CategoryFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(category)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Code",
      color: gradientColorOptions[0].value,
    },
  })

  const watchedValues = form.watch()

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
        })
      } else {
        form.reset({
          name: "",
          description: "",
          icon: "Code",
          color: gradientColorOptions[0].value,
        })
      }
    }
  }, [open, category, form])

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
      if (!isEditing) {
        form.reset({
          name: "",
          description: "",
          icon: "Code",
          color: gradientColorOptions[0].value,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mengakses icon component dengan cara yang benar
  const IconComponent = iconMap[watchedValues.icon as keyof typeof iconMap]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-10">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Icon Field */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconPicker
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose from Lucide React icons
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Field - Using Gradient Color Picker */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <GradientColorFormField
                    field={field}
                    label="Gradient Color"
                    placeholder="Select a gradient color"
                    description="Choose from beautiful gradient combinations"
                    showPreview={false} // We'll show preview below
                    showCategories={true}
                  />
                )}
              />
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${watchedValues.color} text-white shadow-md`}>
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {watchedValues.name || "Category Name"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {watchedValues.description || "Category description will appear here"}
                    </div>
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}