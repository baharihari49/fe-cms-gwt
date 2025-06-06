// types/project.ts
export enum ProjectStatus {
  DEVELOPMENT = 'DEVELOPMENT',
  BETA = 'BETA',
  LIVE = 'LIVE',
  ARCHIVED = 'ARCHIVED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Category {
  id: string
  label: string
  count: number
  createdAt: string
  updatedAt: string
}

export interface Technology {
  id: number
  name: string
}

export interface Feature {
  id: number
  name: string
}

export interface ProjectMetric {
  id: number
  projectId: number
  users?: string
  performance?: string
  rating?: string
  downloads?: string
  revenue?: string
  uptime?: string
}

export interface ProjectLink {
  id: number
  projectId: number
  live?: string
  github?: string
  case?: string
  demo?: string
  docs?: string
}

export interface ProjectImage {
  id?: number
  projectId?: number
  url: string
  caption?: string
  type: 'SCREENSHOT' | 'MOCKUP' | 'LOGO' | 'DIAGRAM' | 'OTHER'
  order?: number
}

export interface ProjectReview {
  id?: number
  projectId?: number
  author: string
  role?: string
  company?: string
  content: string
  rating?: number
}

export interface Project {
  id: number
  title: string
  subtitle: string
  categoryId: string
  category: Category
  type: string
  description: string
  image?: string
  client?: string
  duration?: string
  year?: string
  status: ProjectStatus
  icon?: string
  color?: string
  createdAt: string
  updatedAt: string
  technologies: string[]
  features: string[]
  metrics?: ProjectMetric
  links?: ProjectLink
  images?: ProjectImage[]
  reviews?: ProjectReview[]
}

export interface CreateProjectRequest {
  title: string
  subtitle: string
  categoryId: string
  type: string
  description: string
  image?: string
  images?: ProjectImage[]
  reviews?: ProjectReview[]
  client?: string
  duration?: string
  year?: string
  status?: ProjectStatus
  icon?: string
  color?: string
  technologies?: string[]
  features?: string[]
  metrics?: Omit<ProjectMetric, 'id' | 'projectId'>
  links?: Omit<ProjectLink, 'id' | 'projectId'>
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number
}

export interface ProjectsResponse {
  success: boolean
  projects: Project[]
  total: number
  page: number
  limit: number
}

export interface ProjectResponse {
  success: boolean
  project: Project
  message?: string
}

export interface DeleteProjectResponse {
  success: boolean
  message: string
}