// components/faq-category/faq-category-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FAQCategory } from "./types/faq-category"
import { faqCategoryAPI } from "@/lib/api/faq-category"
import * as Icons from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  icon: z.string().min(1, "Icon is required"),
})

type FormData = z.infer<typeof formSchema>

interface FAQCategoryFormProps {
  category?: FAQCategory
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const iconOptions = [
  { value: "HelpCircle", label: "Help Circle" },
  { value: "CheckCircle", label: "Check Circle" },
  { value: "Clock", label: "Clock" },
  { value: "ArrowRight", label: "Arrow Right" },
  { value: "Phone", label: "Phone" },
  { value: "Settings", label: "Settings" },
  { value: "Users", label: "Users" },
  { value: "Shield", label: "Shield" },
  { value: "FileText", label: "File Text" },
  { value: "Heart", label: "Heart" },
  { value: "Star", label: "Star" },
  { value: "Zap", label: "Zap" },
  { value: "BookOpen", label: "Book Open" },
  { value: "MessageCircle", label: "Message Circle" },
  { value: "Mail", label: "Mail" },
  { value: "Globe", label: "Globe" },
  { value: "Code", label: "Code" },
  { value: "Database", label: "Database" },
  { value: "Server", label: "Server" },
  { value: "Lightbulb", label: "Lightbulb" },
]

export function FAQCategoryForm({ category, open, onOpenChange, onSuccess }: FAQCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!category

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  })

  // Function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  // Watch name field to auto-generate ID
  const watchedName = form.watch("name")
  const [generatedId, setGeneratedId] = useState("")
  
  useEffect(() => {
    if (!isEdit && watchedName) {
      const newId = generateSlug(watchedName)
      setGeneratedId(newId)
    }
  }, [watchedName, isEdit])

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        icon: category.icon,
      })
    } else {
      form.reset({
        name: "",
        icon: "",
      })
    }
  }, [category, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (isEdit && category) {
        await faqCategoryAPI.updateFAQCategory({
          id: category.id, // menggunakan ID dari category yang sudah ada
          name: data.name,
          icon: data.icon,
        })
      } else {
        // Generate ID from name for new category
        const categoryId = generateSlug(data.name)
        await faqCategoryAPI.createFAQCategory({
          id: categoryId,
          name: data.name,
          icon: data.icon,
        })
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save FAQ category:", error)
      toast.error("Failed to save FAQ category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit FAQ Category" : "Add New FAQ Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the FAQ category information below." 
              : "Fill in the information below to add a new FAQ category."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. General, Services, Pricing" 
                      {...field} 
                    />
                  </FormControl>
                  {!isEdit && generatedId && (
                    <FormDescription>
                      Category ID will be: <code className="bg-muted px-1 py-0.5 rounded text-sm">{generatedId}</code>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an icon">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent = Icons[field.value as keyof typeof Icons] as any
                                return IconComponent ? <IconComponent className="h-4 w-4" /> : null
                              })()}
                              <span>{iconOptions.find(opt => opt.value === field.value)?.label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = Icons[option.value as keyof typeof Icons] as any
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {IconComponent && <IconComponent className="h-4 w-4" />}
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose an icon that represents this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog> 
  )
}