// lib/api/faq-category.ts
import {
  CreateFAQCategoryRequest,
  UpdateFAQCategoryRequest,
  FAQCategoriesResponse,
  FAQCategoryResponse,
  DeleteFAQCategoryResponse
} from '@/components/faq/category/types/faq-category'

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

class FAQCategoryAPI {
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

  async getFAQCategories(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<FAQCategoriesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/faqs/categories${queryString ? `?${queryString}` : ''}`)
  }

  async getFAQCategory(id: string): Promise<FAQCategoryResponse> {
    return this.fetchWithAuth(`/api/faqs/categories/${id}`)
  }

  async createFAQCategory(data: CreateFAQCategoryRequest): Promise<FAQCategoryResponse> {
    return this.fetchWithAuth('/api/faqs/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateFAQCategory(data: UpdateFAQCategoryRequest): Promise<FAQCategoryResponse> {
    return this.fetchWithAuth(`/api/faqs/admin/categories/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFAQCategory(id: string): Promise<DeleteFAQCategoryResponse> {
    return this.fetchWithAuth(`/api/faqs/admin/categories/${id}`, {
      method: 'DELETE',
    })
  }
}

export const faqCategoryAPI = new FAQCategoryAPI()