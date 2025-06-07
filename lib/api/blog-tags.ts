// lib/api/blog-tags.ts

import { Tag, CreateTagRequest, UpdateTagRequest } from "@/components/blog/tags/types/tags";

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


class BlogTagAPI {
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

    // Get all tags
    async getAllTags(): Promise<{ success: boolean, tags: Tag[] }> {
        return this.fetchWithAuth('/api/blogs/tags')
    }

    // Get a single tag by ID
    async getTagById(id: string): Promise<{ success: boolean, tag: Tag }> {
        return this.fetchWithAuth(`/api/blogs/tags/${id}`)
    }

    // Create a new tag
    async createTag(data: CreateTagRequest): Promise<{ success: boolean, tag: Tag }> {
        return this.fetchWithAuth('/api/blogs/admin/tags', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Update an existing tag
    async updateTag(id: string, data: UpdateTagRequest): Promise<{ success: boolean, tag: Tag }> {
        return this.fetchWithAuth(`/api/blogs/admin/tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    // Delete a tag
    async deleteTag(id: string): Promise<{ success: boolean }> {
        return this.fetchWithAuth(`/api/blogs/admin/tags/${id}`, {
            method: 'DELETE',
        })
    }
}
export const blogTagAPI = new BlogTagAPI()