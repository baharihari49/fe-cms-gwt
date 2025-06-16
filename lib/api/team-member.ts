// lib/api/team-member.ts
import {
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
  TeamMembersResponse,
  TeamMemberResponse,
  DeleteTeamMemberResponse,
  SearchTeamMembersResponse,
  DepartmentsResponse,
  PositionsResponse,
  SpecialitiesResponse
} from '@/components/team-members/types/team-member'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Helper function to get cookie
function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

class TeamMemberAPI {
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

  // GET /api/team-members - Get all team members with filters
  async getTeamMembers(params?: {
    page?: number
    limit?: number
    sort?: string
    department?: string
    position?: string
    speciality?: string
  }): Promise<TeamMembersResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.department) searchParams.set('department', params.department)
    if (params?.position) searchParams.set('position', params.position)
    if (params?.speciality) searchParams.set('speciality', params.speciality)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/team-members${queryString ? `?${queryString}` : ''}`)
  }

  // GET /api/team-members/:id - Get team member by ID
  async getTeamMember(id: number): Promise<TeamMemberResponse> {
    return this.fetchWithAuth(`/api/team-members/${id}`)
  }

  // GET /api/team-members/name/:name - Get team member by name
  async getTeamMemberByName(name: string): Promise<TeamMemberResponse> {
    return this.fetchWithAuth(`/api/team-members/name/${encodeURIComponent(name)}`)
  }

  // GET /api/team-members/department/:department - Get team members by department
  async getTeamMembersByDepartment(department: string, params?: {
    page?: number
    limit?: number
    sort?: string
  }): Promise<TeamMembersResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/team-members/department/${encodeURIComponent(department)}${queryString ? `?${queryString}` : ''}`)
  }

  // GET /api/team-members/search - Search team members
  async searchTeamMembers(query: string, params?: {
    page?: number
    limit?: number
    sort?: string
    department?: string
    position?: string
    speciality?: string
  }): Promise<SearchTeamMembersResponse> {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.department) searchParams.set('department', params.department)
    if (params?.position) searchParams.set('position', params.position)
    if (params?.speciality) searchParams.set('speciality', params.speciality)

    return this.fetchWithAuth(`/api/team-members/search?${searchParams.toString()}`)
  }

  // POST /api/team-members/admin - Create team member (Admin only)
  async createTeamMember(data: CreateTeamMemberRequest): Promise<TeamMemberResponse> {
    return this.fetchWithAuth('/api/team-members/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT /api/team-members/admin/:id - Update team member (Admin only)
  async updateTeamMember(data: UpdateTeamMemberRequest): Promise<TeamMemberResponse> {
    const { id, ...updateData } = data
    return this.fetchWithAuth(`/api/team-members/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  // DELETE /api/team-members/admin/:id - Delete team member (Admin only)
  async deleteTeamMember(id: number): Promise<DeleteTeamMemberResponse> {
    return this.fetchWithAuth(`/api/team-members/admin/${id}`, {
      method: 'DELETE',
    })
  }

  // GET /api/team-members/meta/departments - Get unique departments
  async getDepartments(): Promise<DepartmentsResponse> {
    return this.fetchWithAuth('/api/team-members/meta/departments')
  }

  // GET /api/team-members/meta/positions - Get unique positions
  async getPositions(): Promise<PositionsResponse> {
    return this.fetchWithAuth('/api/team-members/meta/positions')
  }

  // GET /api/team-members/meta/specialities - Get unique specialities
  async getSpecialities(): Promise<SpecialitiesResponse> {
    return this.fetchWithAuth('/api/team-members/meta/specialities')
  }
}

export const teamMemberAPI = new TeamMemberAPI()