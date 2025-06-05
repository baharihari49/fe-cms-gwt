// components/projects/ProjectForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Project, ProjectStatus, Category, CreateProjectRequest } from "@/components/portfolio/types"
import { projectAPI } from "@/lib/api/portfolio"

// Import tab components
import { BasicTab } from "./tabs/BasicTab"
import { DetailsTab } from "./tabs/DetailsTab"
import { TechFeaturesTab } from "./tabs/TechFeaturesTab"
import { MetricsTab } from "./tabs/MetricsTab"
import { MediaTab } from "./tabs/MediaTab"
import { ReviewsTab } from "./tabs/ReviewsTab"

// Enhanced schema with images and reviews
const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  categoryId: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DEVELOPMENT),
  icon: z.string().optional(),
  color: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  // Metrics
  users: z.string().optional(),
  performance: z.string().optional(),
  rating: z.string().optional(),
  downloads: z.string().optional(),
  revenue: z.string().optional(),
  uptime: z.string().optional(),
  // Links
  live: z.string().optional(),
  github: z.string().optional(),
  case: z.string().optional(),
  demo: z.string().optional(),
  docs: z.string().optional(),
  // Images
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    type: z.enum(['SCREENSHOT', 'MOCKUP', 'LOGO', 'DIAGRAM', 'OTHER']).default('SCREENSHOT'),
    order: z.number().optional()
  })).default([]),
  // Reviews
  reviews: z.array(z.object({
    author: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    content: z.string(),
    rating: z.number().min(1).max(5).optional()
  })).default([])
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ProjectForm({ project, open, onOpenChange, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm({
    resolver: zodResolver(projectFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: "",
      subtitle: "",
      categoryId: "",
      type: "",
      description: "",
      image: "",
      client: "",
      duration: "",
      year: "",
      status: ProjectStatus.DEVELOPMENT,
      icon: "",
      color: "",
      technologies: [] as string[],
      features: [] as string[],
      users: "",
      performance: "",
      rating: "",
      downloads: "",
      revenue: "",
      uptime: "",
      live: "",
      github: "",
      case: "",
      demo: "",
      docs: "",
      images: [],
      reviews: []
    } as any,
  })

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await projectAPI.getCategories()
        if (response.success) {
          setCategories(response.categories)
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    loadCategories()
  }, [])

  // Load project data when editing
  useEffect(() => {
    if (project) {
      const formData = {
        title: project.title,
        subtitle: project.subtitle,
        categoryId: project.categoryId,
        type: project.type,
        description: project.description,
        image: project.image || "",
        client: project.client || "",
        duration: project.duration || "",
        year: project.year || "",
        status: project.status,
        icon: project.icon || "",
        color: project.color || "",
        technologies: project.technologies || [],
        features: project.features || [],
        users: project.metrics?.users || "",
        performance: project.metrics?.performance || "",
        rating: project.metrics?.rating || "",
        downloads: project.metrics?.downloads || "",
        revenue: project.metrics?.revenue || "",
        uptime: project.metrics?.uptime || "",
        live: project.links?.live || "",
        github: project.links?.github || "",
        case: project.links?.case || "",
        demo: project.links?.demo || "",
        docs: project.links?.docs || "",
        images: (project as any).images || [],
        reviews: (project as any).reviews || []
      }
      form.reset(formData as any)
    }
  }, [project, form])

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const requestData: CreateProjectRequest = {
        title: values.title,
        subtitle: values.subtitle,
        categoryId: values.categoryId,
        type: values.type,
        description: values.description,
        image: values.image || undefined,
        client: values.client || undefined,
        duration: values.duration || undefined,
        year: values.year || undefined,
        status: values.status,
        icon: values.icon || undefined,
        color: values.color || undefined,
        technologies: values.technologies,
        features: values.features,
        metrics: {
          users: values.users || undefined,
          performance: values.performance || undefined,
          rating: values.rating || undefined,
          downloads: values.downloads || undefined,
          revenue: values.revenue || undefined,
          uptime: values.uptime || undefined,
        },
        links: {
          live: values.live || undefined,
          github: values.github || undefined,
          case: values.case || undefined,
          demo: values.demo || undefined,
          docs: values.docs || undefined,
        },
        images: values.images || undefined,
        reviews: values.reviews || undefined
      }

      if (project) {
        await projectAPI.updateProject({ ...requestData, id: project.id })
      } else {
        await projectAPI.createProject(requestData)
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
      setActiveTab("basic")
    } catch (error) {
      console.error("Failed to save project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  // Get current values for tabs that need them
  const currentTechnologies = (form.watch("technologies") as string[]) ?? []
  const currentFeatures = (form.watch("features") as string[]) ?? []
  const currentImages = (form.watch("images") as any[]) ?? []
  const currentReviews = (form.watch("reviews") as any[]) ?? []

  // Handler functions for tab components
  const handleTechnologiesChange = (technologies: string[]) => {
    form.setValue("technologies", technologies as any)
  }

  const handleFeaturesChange = (features: string[]) => {
    form.setValue("features", features as any)
  }

  const handleImagesChange = (images: any[]) => {
    form.setValue("images", images as any)
  }

  const handleReviewsChange = (reviews: any[]) => {
    form.setValue("reviews", reviews as any)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project ? "Update project information" : "Add a new project to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <Form {...(form as any)}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="tech">Tech & Features</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <BasicTab 
                  control={form.control as any} 
                  categories={categories} 
                />
              </TabsContent>

              {/* Project Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <DetailsTab 
                  control={form.control as any} 
                />
              </TabsContent>

              {/* Technologies & Features Tab */}
              <TabsContent value="tech" className="space-y-4">
                <TechFeaturesTab
                  currentTechnologies={currentTechnologies}
                  currentFeatures={currentFeatures}
                  onTechnologiesChange={handleTechnologiesChange}
                  onFeaturesChange={handleFeaturesChange}
                />
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="space-y-4">
                <MetricsTab 
                  control={form.control as any} 
                />
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4">
                <MediaTab
                  currentImages={currentImages}
                  onImagesChange={handleImagesChange}
                />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <ReviewsTab
                  currentReviews={currentReviews}
                  onReviewsChange={handleReviewsChange}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const tabs = ["basic", "details", "tech", "metrics", "media", "reviews"]
                      const currentIndex = tabs.indexOf(activeTab)
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1])
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "reviews" && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const tabs = ["basic", "details", "tech", "metrics", "media", "reviews"]
                      const currentIndex = tabs.indexOf(activeTab)
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1])
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}