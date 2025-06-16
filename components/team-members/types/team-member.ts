// components/team-members/types/team-member.ts

export interface TeamMember {
  id: number
  name: string
  position: string
  department: string
  bio: string
  avatar: string
  skills: string[] | any // More flexible to handle JSON data
  experience: string
  projects: string
  speciality: string
  social: SocialLinks | any // More flexible to handle JSON data
  gradient: string
  icon: string
  achievements: Achievement[] | any // More flexible to handle JSON data
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  github?: string
  email?: string
  website?: string
}

export interface Achievement {
  title: string
  description: string
  date: string
  type?: 'award' | 'certification' | 'project' | 'recognition'
}

// Helper function to safely parse skills
export const parseSkills = (skills: any): string[] => {
  if (Array.isArray(skills)) {
    return skills.filter(skill => typeof skill === 'string')
  }
  
  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills)
      return Array.isArray(parsed) ? parsed.filter(skill => typeof skill === 'string') : []
    } catch {
      return [skills] // Treat as single skill
    }
  }
  
  if (skills && typeof skills === 'object' && skills.length !== undefined) {
    return Array.from(skills).filter(skill => typeof skill === 'string')
  }
  
  return []
}

// Helper function to safely parse social links
export const parseSocialLinks = (social: any): SocialLinks => {
  if (typeof social === 'object' && social !== null && !Array.isArray(social)) {
    return social as SocialLinks
  }
  
  if (typeof social === 'string') {
    try {
      const parsed = JSON.parse(social)
      return typeof parsed === 'object' && parsed !== null ? parsed : {}
    } catch {
      return {}
    }
  }
  
  return {}
}

// Helper function to safely parse achievements
export const parseAchievements = (achievements: any): Achievement[] => {
  if (Array.isArray(achievements)) {
    return achievements.filter(achievement => 
      achievement && 
      typeof achievement === 'object' && 
      achievement.title && 
      achievement.description
    )
  }
  
  if (typeof achievements === 'string') {
    try {
      const parsed = JSON.parse(achievements)
      return Array.isArray(parsed) ? parsed.filter(achievement => 
        achievement && 
        typeof achievement === 'object' && 
        achievement.title && 
        achievement.description
      ) : []
    } catch {
      return []
    }
  }
  
  return []
}

// API Request/Response Types
export interface CreateTeamMemberRequest {
  name: string
  position: string
  department: string
  bio: string
  avatar: string
  skills: string[]
  experience: string
  projects: string
  speciality: string
  social: SocialLinks
  gradient: string
  icon: string
  achievements?: Achievement[]
}

export interface UpdateTeamMemberRequest extends Partial<CreateTeamMemberRequest> {
  id: number
}

export interface TeamMemberResponse {
  success: boolean
  data: TeamMember
  message?: string
}

export interface TeamMembersResponse {
  success: boolean
  data: TeamMember[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  message?: string
}

export interface DeleteTeamMemberResponse {
  success: boolean
  message: string
}

export interface SearchTeamMembersResponse {
  success: boolean
  data: TeamMember[]
  query: string
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface DepartmentsResponse {
  success: boolean
  data: string[]
  message?: string
}

export interface PositionsResponse {
  success: boolean
  data: string[]
  message?: string
}

export interface SpecialitiesResponse {
  success: boolean
  data: string[]
  message?: string
}