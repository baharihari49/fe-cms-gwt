// lib/api/testimonial.ts
import {
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  TestimonialsResponse,
  TestimonialResponse,
  DeleteTestimonialResponse
} from '@/components/testimonial/types/testimonial'

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

class TestimonialAPI {
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

  async getTestimonials(params?: {
    page?: number
    limit?: number
    search?: string
    projectId?: number
    clientId?: number
    rating?: number
  }): Promise<TestimonialsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.projectId) searchParams.set('projectId', params.projectId.toString())
    if (params?.clientId) searchParams.set('clientId', params.clientId.toString())
    if (params?.rating) searchParams.set('rating', params.rating.toString())

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/testimonials${queryString ? `?${queryString}` : ''}`)
  }

  async getTestimonial(id: number): Promise<TestimonialResponse> {
    return this.fetchWithAuth(`/api/testimonials/${id}`)
  }

  async createTestimonial(data: CreateTestimonialRequest): Promise<TestimonialResponse> {
    return this.fetchWithAuth('/api/testimonials/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTestimonial(data: UpdateTestimonialRequest): Promise<TestimonialResponse> {
    return this.fetchWithAuth(`/api/testimonials/admin/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTestimonial(id: number): Promise<DeleteTestimonialResponse> {
    return this.fetchWithAuth(`/api/testimonials/admin/${id}`, {
      method: 'DELETE',
    })
  }
}

export const testimonialAPI = new TestimonialAPI()