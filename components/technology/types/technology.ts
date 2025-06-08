// types/technology.ts
export interface Technology {
  id: number
  name: string
  icon?: string
  description?: string
}

export interface CreateTechnologyRequest {
  name: string
  icon?: string
  description?: string
}

export interface UpdateTechnologyRequest {
  id: number
  name: string
  icon?: string
  description?: string
}

export interface TechnologiesResponse {
  success: boolean
  data: Technology[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TechnologyResponse {
  success: boolean
  technology: Technology
}

export interface DeleteTechnologyResponse {
  success: boolean
  message: string
}