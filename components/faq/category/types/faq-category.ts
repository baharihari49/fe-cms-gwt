// types/faq-category.ts
export interface FAQCategory {
  id: string
  name: string
  icon: string
  createdAt: string
  updatedAt: string
  count: number
}

export interface CreateFAQCategoryRequest {
  id: string
  name: string
  icon: string
}

export interface UpdateFAQCategoryRequest {
  id: string
  name: string
  icon: string
}

export interface FAQCategoriesResponse {
  success: boolean
  data: FAQCategory[]
  meta?: {
    total: number
    count: number
  }
}

export interface FAQCategoryResponse {
  success: boolean
  faqCategory: FAQCategory
}

export interface DeleteFAQCategoryResponse {
  success: boolean
  message: string
}