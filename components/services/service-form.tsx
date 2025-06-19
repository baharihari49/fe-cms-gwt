// components/services/service-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X, Search } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Service, Technology } from "@/components/services/types/services"
import { serviceAPI } from "@/lib/api/services"
import { technologyAPI } from "@/lib/api/technology"
import GradientColorFormField from "../GradientColorFormField"
import IconPicker from "@/lib/utils/IconPicker"

const formSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  subtitle: z.string().min(1, "Subtitle is required").max(200, "Subtitle too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().min(1, "Color class is required"),
  features: z.array(z.object({
    name: z.string().min(1, "Feature name is required")
  })).optional(),
  technologies: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

interface ServiceFormProps {
  service?: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ServiceForm({ service, open, onOpenChange, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loadingTechnologies, setLoadingTechnologies] = useState(false)
  const isEdit = !!service

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "",
      title: "",
      subtitle: "",
      description: "",
      color: "",
      features: [{ name: "" }],
      technologies: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  })

  // Load technologies when dialog opens
  useEffect(() => {
    if (open) {
      loadTechnologies()
    }
  }, [open])

  const loadTechnologies = async () => {
    setLoadingTechnologies(true)
    try {
      const response = await technologyAPI.getTechnologies()
      if (response.success && response.data) {
        setTechnologies(response.data)
      } else {
        setTechnologies([])
      }
    } catch (error) {
      console.error("Failed to load technologies:", error)
      toast.error("Failed to load technologies")
    } finally {
      setLoadingTechnologies(false)
    }
  }

  useEffect(() => {
    if (service) {
      form.reset({
        icon: service.icon,
        title: service.title,
        subtitle: service.subtitle,
        description: service.description,
        color: service.color,
        features: service.features.length > 0
          ? service.features.map(f => ({ name: f.name }))
          : [{ name: "" }],
        technologies: service.technologies.map(t => t.technologyId.toString()),
      })
    } else {
      form.reset({
        icon: "",
        title: "",
        subtitle: "",
        description: "",
        color: "",
        features: [{ name: "" }],
        technologies: [],
      })
    }
  }, [service, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const submitData = {
        icon: data.icon,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        color: data.color,
        features: data.features?.filter(f => f.name.trim()).map(f => f.name.trim()),
        technologyIds: data.technologies?.map(id => parseInt(id)),
      }

      if (isEdit && service) {
        await serviceAPI.updateService({
          id: service.id,
          ...submitData,
        })
      } else {
        await serviceAPI.createService(submitData)
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save service:", error)
      toast.error("Failed to save service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the service information below."
              : "Fill in the information below to add a new service."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Web Development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Modern & Responsive Websites"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service in detail..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Features</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`features.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Feature ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((techId) => {
                        const tech = technologies.find(t => t.id.toString() === techId)
                        return tech ? (
                          <Badge key={techId} variant="secondary" className="flex items-center gap-1">
                            {tech.icon} {tech.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== techId) || []
                                field.onChange(newValue)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <Select
                      onValueChange={(value) => {
                        if (value && !field.value?.includes(value)) {
                          field.onChange([...(field.value || []), value])
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add technology" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingTechnologies ? (
                          <SelectItem value="loading" disabled>Loading technologies...</SelectItem>
                        ) : (
                          technologies
                            .filter(tech => !field.value?.includes(tech.id.toString()))
                            .map((tech) => (
                              <SelectItem key={tech.id} value={tech.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{tech.icon}</span>
                                  <span>{tech.name}</span>
                                </div>
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                {isEdit ? "Update" : "Create"} Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}