// types/faq.ts
export interface FAQ {
  id: number
  category: string
  question: string
  answer: string
  popular: boolean
  createdAt: string
  updatedAt: string
  faqCategory: {
    id: string
    name: string
    icon: string
    createdAt: string
    updatedAt: string
  }
}

export interface CreateFAQRequest {
  category: string
  question: string
  answer: string
  popular?: boolean
}

export interface UpdateFAQRequest {
  id: number
  category: string
  question: string
  answer: string
  popular?: boolean
}

export interface FAQsResponse {
  success: boolean
  data: FAQ[]
  meta?: {
    total: number
    count: number
    skip: number
  }
}

export interface FAQResponse {
  success: boolean
  faq: FAQ
}

export interface DeleteFAQResponse {
  success: boolean
  message: string
}