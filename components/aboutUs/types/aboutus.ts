// types/aboutus.ts

// Base entities
export interface CompanyValue {
  id: string
  icon: string
  title: string
  description: string
  color: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  achievement: string
  extendedDescription: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CompanyStat {
  id: string
  icon: string
  number: string
  label: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CompanyInfo {
  id: string
  companyName: string
  previousName: string | null
  foundedYear: string
  mission: string
  vision: string
  aboutHeader: string
  aboutSubheader: string
  journeyTitle: string | null
  storyText: string
  heroImageUrl: string | null
  createdAt: string
  updatedAt: string
}

// Create request types
export interface CreateCompanyValueRequest {
  icon: string
  title: string
  description: string
  color: string
  order?: number
}

export interface CreateTimelineItemRequest {
  year: string
  title: string
  description: string
  achievement: string
  extendedDescription: string
  order?: number
}

export interface CreateCompanyStatRequest {
  icon: string
  number: string
  label: string
  order?: number
}

export interface CreateCompanyInfoRequest {
  companyName: string
  previousName?: string
  foundedYear: string
  mission: string
  vision: string
  aboutHeader: string
  aboutSubheader: string
  journeyTitle?: string
  storyText: string
  heroImageUrl?: string | null
}

// Update request types
export interface UpdateCompanyValueRequest {
  id: string
  icon?: string
  title?: string
  description?: string
  color?: string
  order?: number
}

export interface UpdateTimelineItemRequest {
  id: string
  year?: string
  title?: string
  description?: string
  achievement?: string
  extendedDescription?: string
  order?: number
}

export interface UpdateCompanyStatRequest {
  id: string
  icon?: string
  number?: string
  label?: string
  order?: number
}

export interface UpdateCompanyInfoRequest {
  id: string
  companyName?: string
  previousName?: string
  foundedYear?: string
  mission?: string
  vision?: string
  aboutHeader?: string
  aboutSubheader?: string
  journeyTitle?: string
  storyText?: string
  heroImageUrl?: string | null
}

// Response types
export interface BaseResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: PaginationMeta
}

// Specific response types
export interface CompanyValueResponse extends BaseResponse<CompanyValue> {}
export interface CompanyValuesResponse extends PaginatedResponse<CompanyValue> {}

export interface TimelineItemResponse extends BaseResponse<TimelineItem> {}
export interface TimelineItemsResponse extends PaginatedResponse<TimelineItem> {}

export interface CompanyStatResponse extends BaseResponse<CompanyStat> {}
export interface CompanyStatsResponse extends PaginatedResponse<CompanyStat> {}

export interface CompanyInfoResponse extends BaseResponse<CompanyInfo> {}
export interface CompanyInfosResponse extends PaginatedResponse<CompanyInfo> {}

export interface DeleteResponse extends BaseResponse<null> {}

// Complete About Us data
export interface CompleteAboutUsData {
  companyInfo: CompanyInfo | null
  companyValues: CompanyValue[]
  timelineItems: TimelineItem[]
  companyStats: CompanyStat[]
}

export interface CompleteAboutUsResponse extends BaseResponse<CompleteAboutUsData> {}

// Query parameters
export interface AboutUsQueryParams {
  page?: number
  limit?: number
  sort?: string
}

// Sort options
export type SortField = 'id' | 'order' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface SortOption {
  field: SortField
  order: SortOrder
}