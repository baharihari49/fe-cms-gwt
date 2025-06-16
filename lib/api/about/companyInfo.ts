// lib/api/companyInfo.ts

import {
  CreateCompanyInfoRequest,
  UpdateCompanyInfoRequest,
  CompanyInfoResponse,
  CompanyInfosResponse,
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

class CompanyInfoAPI {
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

  async getCompanyInfos(params?: AboutUsQueryParams): Promise<CompanyInfosResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page !== undefined) searchParams.set('page', params.page.toString())
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)

    const queryString = searchParams.toString()
    const response = await this.fetchWithAuth(`/api/about-us/company-info${queryString ? `?${queryString}` : ''}`)
    
    return response.json()
  }

  async getCompanyInfo(id: string): Promise<CompanyInfoResponse> {
    const response = await this.fetchWithAuth(`/api/about-us/company-info/${id}`)
    return response.json()
  }

  async getMainCompanyInfo(): Promise<CompanyInfoResponse> {
    const response = await this.fetchWithAuth('/api/about-us/company-info/main')
    return response.json()
  }

  async createCompanyInfo(data: CreateCompanyInfoRequest): Promise<CompanyInfoResponse> {
    const response = await this.fetchWithAuth('/api/about-us/company-info', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    return response.json()
  }

  async updateCompanyInfo(data: UpdateCompanyInfoRequest): Promise<CompanyInfoResponse> {
    const { id, ...updateData } = data
    
    const response = await this.fetchWithAuth(`/api/about-us/company-info/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    
    return response.json()
  }

  async deleteCompanyInfo(id: string): Promise<DeleteResponse> {
    const response = await this.fetchWithAuth(`/api/about-us/company-info/${id}`, {
      method: 'DELETE',
    })
    
    return response.json()
  }
}

export const companyInfoAPI = new CompanyInfoAPI()