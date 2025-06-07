// components/blog/categories/types/categories.ts

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
  _count?: {
    posts: number
  }
}

export interface CreateCategoryRequest {
  name: string
  description: string
  icon: string
  color: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  icon?: string
  color?: string
}