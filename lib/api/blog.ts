// lib/api/blog.ts
import {
  BlogPost,
  CreatePostRequest,
  UpdatePostRequest,
  BlogPostsResponse,
  BlogPostResponse,
  DeletePostResponse,
  Category,
  Tag,
  PostFilters,
  PartialUpdatePostRequest,
  Author,
} from '@/components/blog/types/blog'

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

class BlogAPI {
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

  // Get all posts with filters and pagination
  async getPosts(filters?: PostFilters): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (filters?.page) searchParams.set('page', filters.page.toString())
    if (filters?.limit) searchParams.set('limit', filters.limit.toString())
    if (filters?.published !== undefined) searchParams.set('published', filters.published.toString())
    if (filters?.orderBy) searchParams.set('orderBy', filters.orderBy)
    if (filters?.order) searchParams.set('order', filters.order)

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/blogs/posts${queryString ? `?${queryString}` : ''}`)
  }

  // Get post by ID
  async getPost(id: string): Promise<BlogPostResponse> {
    return this.fetchWithAuth(`/api/blogs/posts/${id}`)
  }

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPostResponse> {
    return this.fetchWithAuth(`/api/blogs/posts/slug/${slug}`)
  }

  // Create new post
  async createPost(data: CreatePostRequest): Promise<BlogPostResponse> {
    return this.fetchWithAuth('/api/blogs/admin/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Update post
  async updatePost(data: UpdatePostRequest | PartialUpdatePostRequest): Promise<BlogPostResponse> {
    const { id, ...updateData } = data
    return this.fetchWithAuth(`/api/blogs/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  // Delete post
  async deletePost(id: string): Promise<DeletePostResponse> {
    return this.fetchWithAuth(`/api/blogs/admin/posts/${id}`, {
      method: 'DELETE',
    })
  }

  // Search posts
  async searchPosts(query: string, filters?: Omit<PostFilters, 'search'>): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams({ q: query })
    
    if (filters?.page) searchParams.set('page', filters.page.toString())
    if (filters?.limit) searchParams.set('limit', filters.limit.toString())

    return this.fetchWithAuth(`/api/blogs/posts/search?${searchParams.toString()}`)
  }

  // Get posts by category
  async getPostsByCategory(categoryId: string, filters?: PostFilters): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (filters?.page) searchParams.set('page', filters.page.toString())
    if (filters?.limit) searchParams.set('limit', filters.limit.toString())

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/blogs/posts/category/${categoryId}${queryString ? `?${queryString}` : ''}`)
  }

  // Get posts by tag
  async getPostsByTag(tagId: string, filters?: PostFilters): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (filters?.page) searchParams.set('page', filters.page.toString())
    if (filters?.limit) searchParams.set('limit', filters.limit.toString())

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/blogs/posts/tag/${tagId}${queryString ? `?${queryString}` : ''}`)
  }

  // Get posts by author
  async getPostsByAuthor(authorId: string, filters?: PostFilters): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (filters?.page) searchParams.set('page', filters.page.toString())
    if (filters?.limit) searchParams.set('limit', filters.limit.toString())

    const queryString = searchParams.toString()
    return this.fetchWithAuth(`/api/blogs/posts/author/${authorId}${queryString ? `?${queryString}` : ''}`)
  }

  // Get featured posts
  async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    return this.fetchWithAuth(`/api/blogs/posts/featured?limit=${limit}`)
  }

  // Get popular posts
  async getPopularPosts(limit = 5, period = '7d'): Promise<BlogPost[]> {
    return this.fetchWithAuth(`/api/blogs/posts/popular?limit=${limit}&period=${period}`)
  }

  // Get recent posts
  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    return this.fetchWithAuth(`/api/blogs/posts/recent?limit=${limit}`)
  }

  // Update post stats
  async updatePostStats(postId: string, action: 'like' | 'unlike' | 'share'): Promise<any> {
    return this.fetchWithAuth(`/api/blogs/posts/${postId}/stats`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    })
  }

  // Get categories
  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    return this.fetchWithAuth('/api/blogs/categories')
  }

  // Get tags
  async getTags(): Promise<{ success: boolean; tags: Tag[] }> {
    return this.fetchWithAuth('/api/blogs/tags')
  }

  // Get Author
  async getAuthors(): Promise<{ success: boolean; authors: Author[] }> {
    return this.fetchWithAuth(`/api/blogs/authors`)
  }
}

export const blogAPI = new BlogAPI()