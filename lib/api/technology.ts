// lib/api/technology.ts
import {
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
  TechnologiesResponse,
  TechnologyResponse,
  DeleteTechnologyResponse
} from '@/components/technology/types/technology'

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

class TechnologyAPI {
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

  async getTechnologies(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<TechnologiesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/technologies${queryString ? `?${queryString}` : ''}`)
  }

  async getTechnology(id: number): Promise<TechnologyResponse> {
    return this.fetchWithAuth(`/api/technologies/${id}`)
  }

  async createTechnology(data: CreateTechnologyRequest): Promise<TechnologyResponse> {
    return this.fetchWithAuth('/api/technologies/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTechnology(data: UpdateTechnologyRequest): Promise<TechnologyResponse> {
    return this.fetchWithAuth(`/api/technologies/admin/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTechnology(id: number): Promise<DeleteTechnologyResponse> {
    return this.fetchWithAuth(`/api/technologies/admin/${id}`, {
      method: 'DELETE',
    })
  }
}

export const technologyAPI = new TechnologyAPI()