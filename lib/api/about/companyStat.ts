// lib/api/companyStat.ts

import {
  CreateCompanyStatRequest,
  UpdateCompanyStatRequest,
  CompanyStatResponse,
  CompanyStatsResponse,
  DeleteResponse,
  AboutUsQueryParams
} from '@/components/aboutUs/types/aboutus'

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

class CompanyStatAPI {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getCookie('token')
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || error.message || `HTTP ${response.status}`)
    }

    return response
  }

  async getCompanyStats(params?: AboutUsQueryParams): Promise<CompanyStatsResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page !== undefined) searchParams.set('page', params.page.toString())
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)

    const queryString = searchParams.toString()
    const response = await this.fetchWithAuth(`/api/about-us/company-stats${queryString ? `?${queryString}` : ''}`)
    
    return response.json()
  }

  async getCompanyStat(id: string): Promise<CompanyStatResponse> {
    const response = await this.fetchWithAuth(`/api/about-us/company-stats/${id}`)
    return response.json()
  }

  async createCompanyStat(data: CreateCompanyStatRequest): Promise<CompanyStatResponse> {
    const response = await this.fetchWithAuth('/api/about-us/company-stats', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    return response.json()
  }

  async updateCompanyStat(data: UpdateCompanyStatRequest): Promise<CompanyStatResponse> {
    const { id, ...updateData } = data
    
    const response = await this.fetchWithAuth(`/api/about-us/company-stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    
    return response.json()
  }

  async deleteCompanyStat(id: string): Promise<DeleteResponse> {
    const response = await this.fetchWithAuth(`/api/about-us/company-stats/${id}`, {
      method: 'DELETE',
    })
    
    return response.json()
  }
}

export const companyStatAPI = new CompanyStatAPI()