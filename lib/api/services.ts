// lib/api/services.ts
import {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServicesResponse,
  ServiceResponse,
  DeleteServiceResponse
} from '@/components/services/types/services'

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

class ServiceAPI {
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

  async getServices(params?: {
    page?: number
    limit?: number
    search?: string
    include?: string
  }): Promise<ServicesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.include) searchParams.set('include', params.include)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/services${queryString ? `?${queryString}` : ''}`)
  }

  async getService(id: number): Promise<ServiceResponse> {
    return this.fetchWithAuth(`/api/services/${id}`)
  }

  async createService(data: CreateServiceRequest): Promise<ServiceResponse> {
    return this.fetchWithAuth('/api/services/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateService(data: UpdateServiceRequest): Promise<ServiceResponse> {
    return this.fetchWithAuth(`/api/services/admin/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteService(id: number): Promise<DeleteServiceResponse> {
    return this.fetchWithAuth(`/api/services/admin/${id}`, {
      method: 'DELETE',
    })
  }
}

export const serviceAPI = new ServiceAPI()