// lib/api/client.ts
import {
  CreateClientRequest,
  UpdateClientRequest,
  ClientsResponse,
  ClientResponse,
  DeleteClientResponse
} from '@/components/client/types/clients'

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

class ClientAPI {
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

  async getClients(params?: {
    page?: number
    limit?: number
    search?: string
    industry?: string
    isActive?: boolean
  }): Promise<ClientsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.industry) searchParams.set('industry', params.industry)
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString())

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/clients${queryString ? `?${queryString}` : ''}`)
  }

  async getClient(id: number): Promise<ClientResponse> {
    return this.fetchWithAuth(`/api/clients/${id}`)
  }

  async createClient(data: CreateClientRequest): Promise<ClientResponse> {
    return this.fetchWithAuth('/api/clients/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateClient(data: UpdateClientRequest): Promise<ClientResponse> {
    return this.fetchWithAuth(`/api/clients/admin/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteClient(id: number): Promise<DeleteClientResponse> {
    return this.fetchWithAuth(`/api/clients/admin/${id}`, {
      method: 'DELETE',
    })
  }
}

export const clientAPI = new ClientAPI()