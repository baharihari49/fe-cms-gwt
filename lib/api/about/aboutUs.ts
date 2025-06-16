// lib/api/aboutUs.ts

import { CompleteAboutUsResponse } from '@/components/aboutUs/types/aboutus'

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

class AboutUsAPI {
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

  async getCompleteAboutUsData(): Promise<CompleteAboutUsResponse> {
    const response = await this.fetchWithAuth('/api/about-us/complete')
    return response.json()
  }
}

export const aboutUsAPI = new AboutUsAPI()