// lib/api/contact.ts
import {
  CreateContactRequest,
  UpdateContactRequest,
  ContactsResponse,
  ContactResponse,
  DeleteContactResponse
} from '@/components/contacts/types/contact'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

class ContactAPI {
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
      throw new Error(error.message || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getContacts(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ContactsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('q', params.search)

    const queryString = searchParams.toString()
    const endpoint = params?.search ? '/api/contacts/search' : '/api/contacts'
    return this.fetchWithAuth(`${endpoint}${queryString ? `?${queryString}` : ''}`)
  }

  async getContact(id: number): Promise<ContactResponse> {
    return this.fetchWithAuth(`/api/contacts/${id}`)
  }

  async createContact(data: CreateContactRequest): Promise<ContactResponse> {
    return this.fetchWithAuth('/api/contacts/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateContact(data: UpdateContactRequest): Promise<ContactResponse> {
    const { id, ...updateData } = data
    return this.fetchWithAuth(`/api/contacts/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async deleteContact(id: number): Promise<DeleteContactResponse> {
    return this.fetchWithAuth(`/api/contacts/admin/${id}`, {
      method: 'DELETE',
    })
  }
}

export const contactAPI = new ContactAPI()