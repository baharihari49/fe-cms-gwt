
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
}

export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
}