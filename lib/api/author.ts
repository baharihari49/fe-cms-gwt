// lib/api/author.ts
import {
  CreateAuthorRequest,
  UpdateAuthorRequest,
  AuthorsResponse,
  AuthorResponse,
  DeleteAuthorResponse
} from '@/components/blog/authors/types/author'

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

class AuthorAPI {
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

  async getAuthors(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<AuthorsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/blogs/authors${queryString ? `?${queryString}` : ''}`)
  }

  async getAuthor(id: string): Promise<AuthorResponse> {
    return this.fetchWithAuth(`/api/blogs/admin/authors/${id}`)
  }

  async createAuthor(data: CreateAuthorRequest): Promise<AuthorResponse> {
    return this.fetchWithAuth('/api/blogs/admin/authors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAuthor(data: UpdateAuthorRequest): Promise<AuthorResponse> {
    return this.fetchWithAuth(`/api/blogs/admin/authors/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAuthor(id: string): Promise<DeleteAuthorResponse> {
    return this.fetchWithAuth(`/api/blogs/admin/authors/${id}`, {
      method: 'DELETE',
    })
  }
}

export const authorAPI = new AuthorAPI()