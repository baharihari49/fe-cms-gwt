// lib/api/projects.ts
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse,
  DeleteProjectResponse,
  Category
} from '@/components/portfolio/types'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Fungsi bantuan untuk mengatur / membaca cookie
function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

class ProjectAPI {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${getCookie('token')}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getProjects(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }): Promise<ProjectsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.status) searchParams.set('status', params.status)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/projects${queryString ? `?${queryString}` : ''}`)
  }

  async getProject(id: number): Promise<ProjectResponse> {
    return this.fetchWithAuth(`/api/projects/${id}`)
  }

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    return this.fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(data: UpdateProjectRequest): Promise<ProjectResponse> {
    return this.fetchWithAuth(`/api/projects/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: number): Promise<DeleteProjectResponse> {
    return this.fetchWithAuth(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    return this.fetchWithAuth('/api/categories')
  }
}

export const projectAPI = new ProjectAPI()