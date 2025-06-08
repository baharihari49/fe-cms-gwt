// components/testimonials/testimonial-form.tsx
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
import { Loader2, Star } from "lucide-react"
import { Testimonial } from "@/components/testimonial/types/testimonial"
import { testimonialAPI } from "@/lib/api/testimonial"
import { projectAPI } from "@/lib/api/portfolio"
import { clientAPI } from "@/lib/api/client"

const formSchema = z.object({
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  author: z.string().min(1, "Author name is required").max(100, "Name too long"),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters").max(1000, "Content too long"),
  rating: z.string().optional(),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type FormData = z.infer<typeof formSchema>

interface TestimonialFormProps {
  testimonial?: Testimonial
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TestimonialForm({ testimonial, open, onOpenChange, onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Array<{id: number, title: string}>>([])
  const [clients, setClients] = useState<Array<{id: number, name: string}>>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const isEdit = !!testimonial

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "none",
      clientId: "none",
      author: "",
      role: "",
      company: "",
      content: "",
      rating: "none",
      avatar: "",
    },
  })

  // Load projects and clients when dialog opens
  useEffect(() => {
    if (open) {
      loadOptions()
    }
  }, [open])

  const loadOptions = async () => {
    setLoadingOptions(true)
    try {
      const [projectsResponse, clientsResponse] = await Promise.all([
        projectAPI.getProjects(),
        clientAPI.getClients()
      ])
      
      if (projectsResponse.success && projectsResponse.projects) {
        setProjects(projectsResponse.projects.map(p => ({ id: p.id, title: p.title })))
      }
      
      if (clientsResponse.success && clientsResponse.data) {
        setClients(clientsResponse.data.map(c => ({ id: c.id, name: c.name })))
      }
    } catch (error) {
      console.error("Failed to load options:", error)
      toast.error("Failed to load projects and clients")
    } finally {
      setLoadingOptions(false)
    }
  }

  useEffect(() => {
    if (testimonial) {
      form.reset({
        projectId: testimonial.projectId?.toString() || "none",
        clientId: testimonial.clientId?.toString() || "none",
        author: testimonial.author,
        role: testimonial.role || "",
        company: testimonial.company || "",
        content: testimonial.content,
        rating: testimonial.rating?.toString() || "none",
        avatar: testimonial.avatar || "",
      })
    } else {
      form.reset({
        projectId: "none",
        clientId: "none",
        author: "",
        role: "",
        company: "",
        content: "",
        rating: "none",
        avatar: "",
      })
    }
  }, [testimonial, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const submitData = {
        ...data,
        projectId: data.projectId && data.projectId !== "none" ? parseInt(data.projectId) : undefined,
        clientId: data.clientId && data.clientId !== "none" ? parseInt(data.clientId) : undefined,
        rating: data.rating && data.rating !== "none" ? parseFloat(data.rating) : undefined,
        avatar: data.avatar || undefined,
        role: data.role || undefined,
        company: data.company || undefined,
      }

      if (isEdit && testimonial) {
        await testimonialAPI.updateTestimonial({
          id: testimonial.id,
          ...submitData,
        })
      } else {
        await testimonialAPI.createTestimonial(submitData)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save testimonial:", error)
      toast.error("Failed to save testimonial")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the testimonial information below." 
              : "Fill in the information below to add a new testimonial."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Project</SelectItem>
                        {loadingOptions ? (
                          <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                        ) : (
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Client</SelectItem>
                        {loadingOptions ? (
                          <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                        ) : (
                          clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. John Smith" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. CEO, CTO, Manager" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Tech Corp Inc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial Content *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write the testimonial content here..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Rating</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5.0)</SelectItem>
                        <SelectItem value="4.5">⭐⭐⭐⭐⭐ (4.5)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4.0)</SelectItem>
                        <SelectItem value="3.5">⭐⭐⭐⭐ (3.5)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3.0)</SelectItem>
                        <SelectItem value="2.5">⭐⭐⭐ (2.5)</SelectItem>
                        <SelectItem value="2">⭐⭐ (2.0)</SelectItem>
                        <SelectItem value="1.5">⭐⭐ (1.5)</SelectItem>
                        <SelectItem value="1">⭐ (1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/avatar.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isEdit ? "Update" : "Create"} Testimonial
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}