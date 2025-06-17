// lib/api/hero.ts
import {
  CreateHeroSectionRequest,
  UpdateHeroSectionRequest,
  CreateSocialMediaRequest,
  UpdateSocialMediaRequest,
  HeroResponse,
  HeroSectionResponse,
  HeroSectionsResponse,
  SocialMediaResponse,
  SocialMediaItemResponse,
  PaginatedSocialMediaResponse,
  DeleteResponse
} from '@/components/hero/types/hero'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Fungsi bantuan untuk mengatur / membaca cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

class HeroAPI {
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

  private async fetchPublic(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Public APIs
  async getHeroData(includeSocialMedia: boolean = true): Promise<HeroResponse> {
    const url = includeSocialMedia ? '/api/hero?include=socialMedia' : '/api/hero'
    return this.fetchPublic(url)
  }

  async getSocialMedia(): Promise<SocialMediaResponse> {
    return this.fetchPublic('/api/hero/social-media')
  }

  async getSocialMediaById(id: string): Promise<SocialMediaItemResponse> {
    return this.fetchPublic(`/api/hero/social-media/${id}`)
  }

  // Admin APIs - Hero Sections
  async getAllHeroSections(): Promise<HeroSectionsResponse> {
    return this.fetchWithAuth('/api/hero/admin/sections')
  }

  async getHeroSectionById(id: string): Promise<HeroSectionResponse> {
    return this.fetchWithAuth(`/api/hero/admin/sections/${id}`)
  }

  async createHeroSection(data: CreateHeroSectionRequest): Promise<HeroSectionResponse> {
    return this.fetchWithAuth('/api/hero/admin/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateHeroSection(data: UpdateHeroSectionRequest): Promise<HeroSectionResponse> {
    const { id, ...updateData } = data
    return this.fetchWithAuth(`/api/hero/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async deleteHeroSection(id: string): Promise<DeleteResponse> {
    return this.fetchWithAuth(`/api/hero/admin/sections/${id}`, {
      method: 'DELETE',
    })
  }

  // Admin APIs - Social Media
  async getAllSocialMediaAdmin(params?: {
    page?: number
    limit?: number
    sort?: string
  }): Promise<PaginatedSocialMediaResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/hero/social-media${queryString ? `?${queryString}` : ''}`)
  }

  async createSocialMedia(data: CreateSocialMediaRequest): Promise<SocialMediaItemResponse> {
    return this.fetchWithAuth('/api/hero/admin/social-media', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSocialMedia(data: UpdateSocialMediaRequest): Promise<SocialMediaItemResponse> {
    const { id, ...updateData } = data
    return this.fetchWithAuth(`/api/hero/admin/social-media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async deleteSocialMedia(id: string): Promise<DeleteResponse> {
    return this.fetchWithAuth(`/api/hero/admin/social-media/${id}`, {
      method: 'DELETE',
    })
  }
}

export const heroAPI = new HeroAPI()