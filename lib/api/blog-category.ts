// lib/api/blog-category.ts

import {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest
} from '@/components/blog/categories/types/categories'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    return (
        document.cookie
            .split('; ')
            .find((row) => row.startsWith(name + '='))
            ?.split('=')[1] || null
    )
}


class BlogCategoryAPI {
    private async fetchWithAuth(url: string, options: RequestInit = {}) {
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
            throw new Error(error.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    // Get all categories
    async getAllCategories(): Promise<{ success: boolean, categories: Category[] }> {
        return this.fetchWithAuth('/api/blogs/categories')
    }

    // Get a single category by ID
    async getCategoryById(id: string): Promise<{ success: boolean, category: Category }> {
        return this.fetchWithAuth(`/api/blogs/categories/${id}`)
    }

    //Create a new category
    async createCategory(data: CreateCategoryRequest): Promise<{ success: boolean, category: Category }> {
        return this.fetchWithAuth('/api/blogs/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Update an existing category
    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<{ success: boolean, category: Category }> {
        return this.fetchWithAuth(`/api/blogs/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    // Delete a category
    async deleteCategory(id: string): Promise<{ success: boolean }> {
        return this.fetchWithAuth(`/api/blogs/admin/categories/${id}`, {
            method: 'DELETE',
        })
    }
}


export const blogCategoryAPI = new BlogCategoryAPI()