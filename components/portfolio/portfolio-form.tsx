// components/projects/ProjectForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm, Control } from "react-hook-form"
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

// Define the image type
export interface ProjectImage {
  url: string
  caption?: string
  type: 'SCREENSHOT' | 'MOCKUP' | 'LOGO' | 'DIAGRAM' | 'OTHER'
  order?: number
}

// Define the review type
export interface ProjectReview {
  author: string
  role?: string
  company?: string
  content: string
  rating?: number
}

// Base schema for form input (all fields as strings/arrays)
const projectFormInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  categoryId: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string(),
  client: z.string(),
  duration: z.string(),
  year: z.string(),
  status: z.nativeEnum(ProjectStatus),
  icon: z.string(),
  color: z.string(),
  technologies: z.array(z.string()),
  features: z.array(z.string()),
  // Metrics
  users: z.string(),
  performance: z.string(),
  rating: z.string(),
  downloads: z.string(),
  revenue: z.string(),
  uptime: z.string(),
  // Links
  live: z.string(),
  github: z.string(),
  case: z.string(),
  demo: z.string(),
  docs: z.string(),
  // Images
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    type: z.enum(['SCREENSHOT', 'MOCKUP', 'LOGO', 'DIAGRAM', 'OTHER']),
    order: z.number().optional()
  })),
  // Reviews
  reviews: z.array(z.object({
    author: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    content: z.string(),
    rating: z.number().min(1).max(5).optional()
  }))
})

// Enhanced schema with transformation for API
// const projectFormSchema = projectFormInputSchema.transform((data) => {
//   // Transform empty strings to undefined for optional fields in the API
//   return {
//     ...data,
//     image: data.image || undefined,
//     client: data.client || undefined,
//     duration: data.duration || undefined,
//     year: data.year || undefined,
//     icon: data.icon || undefined,
//     color: data.color || undefined,
//     users: data.users || undefined,
//     performance: data.performance || undefined,
//     rating: data.rating || undefined,
//     downloads: data.downloads || undefined,
//     revenue: data.revenue || undefined,
//     uptime: data.uptime || undefined,
//     live: data.live || undefined,
//     github: data.github || undefined,
//     case: data.case || undefined,
//     demo: data.demo || undefined,
//     docs: data.docs || undefined,
//   }
// })

// Type for form input (the main type we'll use)
type ProjectFormData = z.infer<typeof projectFormInputSchema>

interface ProjectFormProps {
  project?: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ProjectForm({ project, open, onOpenChange, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<string>("basic")

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormInputSchema),
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
      technologies: [],
      features: [],
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
    },
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
      const formData: ProjectFormData = {
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
        images: (project as Project & { images?: ProjectImage[] }).images || [],
        reviews: (project as Project & { reviews?: ProjectReview[] }).reviews || []
      }
      form.reset(formData)
    }
  }, [project, form])

  const onSubmit = async (values: ProjectFormData) => {
    setLoading(true)
    try {
      // Transform the form data manually
      const transformedValues = {
        ...values,
        image: values.image || undefined,
        client: values.client || undefined,
        duration: values.duration || undefined,
        year: values.year || undefined,
        icon: values.icon || undefined,
        color: values.color || undefined,
        users: values.users || undefined,
        performance: values.performance || undefined,
        rating: values.rating || undefined,
        downloads: values.downloads || undefined,
        revenue: values.revenue || undefined,
        uptime: values.uptime || undefined,
        live: values.live || undefined,
        github: values.github || undefined,
        case: values.case || undefined,
        demo: values.demo || undefined,
        docs: values.docs || undefined,
      }

      const requestData: CreateProjectRequest = {
        title: transformedValues.title,
        subtitle: transformedValues.subtitle,
        categoryId: transformedValues.categoryId,
        type: transformedValues.type,
        description: transformedValues.description,
        image: transformedValues.image,
        client: transformedValues.client,
        duration: transformedValues.duration,
        year: transformedValues.year,
        status: transformedValues.status,
        icon: transformedValues.icon,
        color: transformedValues.color,
        technologies: transformedValues.technologies,
        features: transformedValues.features,
        metrics: {
          users: transformedValues.users,
          performance: transformedValues.performance,
          rating: transformedValues.rating,
          downloads: transformedValues.downloads,
          revenue: transformedValues.revenue,
          uptime: transformedValues.uptime,
        },
        links: {
          live: transformedValues.live,
          github: transformedValues.github,
          case: transformedValues.case,
          demo: transformedValues.demo,
          docs: transformedValues.docs,
        },
        images: values.images.length > 0 ? values.images : undefined,
        reviews: values.reviews.length > 0 ? values.reviews : undefined
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

  // Get current values for tabs that need them
  const currentTechnologies = form.watch("technologies")
  const currentFeatures = form.watch("features")
  const currentImages = form.watch("images")
  const currentReviews = form.watch("reviews")

  // Handler functions for tab components
  const handleTechnologiesChange = (technologies: string[]) => {
    form.setValue("technologies", technologies)
  }

  const handleFeaturesChange = (features: string[]) => {
    form.setValue("features", features)
  }

  const handleImagesChange = (images: ProjectImage[]) => {
    form.setValue("images", images)
  }

  const handleReviewsChange = (reviews: ProjectReview[]) => {
    form.setValue("reviews", reviews)
  }

  const tabs = ["basic", "details", "tech", "metrics", "media", "reviews"] as const
  type TabType = typeof tabs[number]

  const handleTabNavigation = (direction: 'prev' | 'next') => {
    const currentIndex = tabs.indexOf(activeTab as TabType)
    if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  control={form.control as Control<ProjectFormData>} 
                  categories={categories} 
                />
              </TabsContent>

              {/* Project Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <DetailsTab 
                  control={form.control as Control<ProjectFormData>} 
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
                  control={form.control as Control<ProjectFormData>} 
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
                    onClick={() => handleTabNavigation('prev')}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "reviews" && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleTabNavigation('next')}
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