// components/services/types/service.ts

export interface Service {
  id: number
  icon: string
  title: string
  subtitle: string
  description: string
  color: string
  createdAt: string
  updatedAt: string
  features: ServiceFeature[]
  technologies: ServiceTechnology[]
}

export interface ServiceFeature {
  id: number
  name: string
  serviceId: number
}

export interface ServiceTechnology {
  id: number
  name: string
  serviceId: number
  technologyId: number
  technology: Technology
}

export interface Technology {
  id: number
  name: string
  icon?: string
  description?: string
}

// Request/Response types
export interface CreateServiceRequest {
  icon: string
  title: string
  subtitle: string
  description: string
  color: string
  features?: string[]
  technologyIds?: number[]
}

export interface UpdateServiceRequest extends CreateServiceRequest {
  id: number
}

export interface ServicesResponse {
  success: boolean
  data?: Service[]
  services?: Service[]
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ServiceResponse {
  success: boolean
  data?: Service
  service?: Service
  error?: string
}

export interface DeleteServiceResponse {
  success: boolean
  message?: string
  error?: string
}