// types/testimonial.ts
export interface Testimonial {
  id: number
  projectId?: number
  project?: {
    id: number
    title: string
  }
  clientId?: number
  client?: {
    id: number
    name: string
  }
  author: string
  role?: string
  company?: string
  content: string
  rating?: number
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTestimonialRequest {
  projectId?: number
  clientId?: number
  author: string
  role?: string
  company?: string
  content: string
  rating?: number
  avatar?: string
}

export interface UpdateTestimonialRequest {
  id: number
  projectId?: number
  clientId?: number
  author: string
  role?: string
  company?: string
  content: string
  rating?: number
  avatar?: string
}

export interface TestimonialsResponse {
  success: boolean
  data: Testimonial[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TestimonialResponse {
  success: boolean
  data: Testimonial
}

export interface DeleteTestimonialResponse {
  success: boolean
  message: string
}
