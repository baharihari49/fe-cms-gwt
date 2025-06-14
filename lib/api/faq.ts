// lib/api/faq.ts
import {
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQsResponse,
  FAQResponse,
  DeleteFAQResponse
} from '@/components/faq/types/faq'

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

class FAQAPI {
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

  async getFAQs(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
  }): Promise<FAQsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.category) searchParams.set('category', params.category)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/faqs/items${queryString ? `?${queryString}` : ''}`)
  }

  async getFAQ(id: number): Promise<FAQResponse> {
    return this.fetchWithAuth(`/api/faqs/items/${id}`)
  }

  async createFAQ(data: CreateFAQRequest): Promise<FAQResponse> {
    return this.fetchWithAuth('/api/faqs/admin/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateFAQ(data: UpdateFAQRequest): Promise<FAQResponse> {
    return this.fetchWithAuth(`/api/faqs/admin/items/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFAQ(id: number): Promise<DeleteFAQResponse> {
    return this.fetchWithAuth(`/api/faqs/admin/items/${id}`, {
      method: 'DELETE',
    })
  }
}

export const faqAPI = new FAQAPI()