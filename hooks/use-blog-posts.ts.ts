// hooks/use-blog-posts.ts
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { blogAPI } from '@/lib/api/blog'
import {
  BlogPost,
  Category,
  Tag,
  PostFilters,
  CreatePostRequest,
  UpdatePostRequest,
  BlogPostsResponse
} from '@/components/blog/types/blog'

interface UseBlogPostsReturn {
  // Data
  posts: BlogPost[]
  categories: Category[]
  tags: Tag[]
  totalCount: number
  
  // Loading states
  loading: boolean
  formLoading: boolean
  
  // Pagination
  pagination: {
    pageIndex: number
    pageSize: number
  }
  
  // Filters
  filters: PostFilters
  
  // Actions
  fetchPosts: () => Promise<void>
  createPost: (data: CreatePostRequest) => Promise<void>
  updatePost: (data: UpdatePostRequest) => Promise<void>
  deletePost: (id: string) => Promise<void>
  togglePublishStatus: (post: BlogPost) => Promise<void>
  searchPosts: (query: string) => Promise<void>
  filterByCategory: (categoryId: string | null) => Promise<void>
  filterByTag: (tagId: string | null) => Promise<void>
  filterByPublished: (published: boolean | null) => void
  
  // Pagination handlers
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void
  
  // Reset functions
  resetFilters: () => void
}

export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  
  const [pagination, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    limit: 10,
    published: undefined,
    orderBy: 'publishedAt',
    order: 'desc',
  })

  // Fetch posts with current filters
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await blogAPI.getPosts(filters)
      setPosts(response.posts)
      setTotalCount(response.pagination.total)
    } catch (error) {
      toast.error('Failed to fetch posts')
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await blogAPI.getCategories()
      if (response.success) {
        setCategories(response.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await blogAPI.getTags()
      if (response.success) {
        setTags(response.tags)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }, [])

  // Create new post
  const createPost = useCallback(async (data: CreatePostRequest) => {
    try {
      setFormLoading(true)
      await blogAPI.createPost(data)
      toast.success('Post created successfully')
      await fetchPosts()
    } catch (error) {
      toast.error('Failed to create post')
      console.error('Error creating post:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }, [fetchPosts])

  // Update existing post
  const updatePost = useCallback(async (data: UpdatePostRequest) => {
    try {
      setFormLoading(true)
      await blogAPI.updatePost(data)
      toast.success('Post updated successfully')
      await fetchPosts()
    } catch (error) {
      toast.error('Failed to update post')
      console.error('Error updating post:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }, [fetchPosts])

  // Delete post
  const deletePost = useCallback(async (id: string) => {
    try {
      setFormLoading(true)
      await blogAPI.deletePost(id)
      toast.success('Post deleted successfully')
      await fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
      console.error('Error deleting post:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }, [fetchPosts])

  // Toggle publish status
  const togglePublishStatus = useCallback(async (post: BlogPost) => {
    try {
      setFormLoading(true)
      await blogAPI.updatePost({
        id: post.id,
        published: !post.published,
      })
      toast.success(`Post ${post.published ? 'unpublished' : 'published'} successfully`)
      await fetchPosts()
    } catch (error) {
      toast.error('Failed to update post status')
      console.error('Error updating post status:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }, [fetchPosts])

  // Search posts
  const searchPosts = useCallback(async (query: string) => {
    try {
      setLoading(true)
      if (query.trim()) {
        const response = await blogAPI.searchPosts(query, {
          page: 1,
          limit: filters.limit,
        })
        setPosts(response.posts)
        setTotalCount(response.pagination.total)
        setPaginationState(prev => ({ ...prev, pageIndex: 0 }))
      } else {
        await fetchPosts()
      }
    } catch (error) {
      toast.error('Failed to search posts')
      console.error('Error searching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [filters.limit, fetchPosts])

  // Filter by category
  const filterByCategory = useCallback(async (categoryId: string | null) => {
    try {
      setLoading(true)
      if (categoryId) {
        const response = await blogAPI.getPostsByCategory(categoryId, {
          page: 1,
          limit: filters.limit,
        })
        setPosts(response.posts)
        setTotalCount(response.pagination.total)
      } else {
        await fetchPosts()
      }
      setPaginationState(prev => ({ ...prev, pageIndex: 0 }))
    } catch (error) {
      toast.error('Failed to filter by category')
      console.error('Error filtering by category:', error)
    } finally {
      setLoading(false)
    }
  }, [filters.limit, fetchPosts])

  // Filter by tag
  const filterByTag = useCallback(async (tagId: string | null) => {
    try {
      setLoading(true)
      if (tagId) {
        const response = await blogAPI.getPostsByTag(tagId, {
          page: 1,
          limit: filters.limit,
        })
        setPosts(response.posts)
        setTotalCount(response.pagination.total)
      } else {
        await fetchPosts()
      }
      setPaginationState(prev => ({ ...prev, pageIndex: 0 }))
    } catch (error) {
      toast.error('Failed to filter by tag')
      console.error('Error filtering by tag:', error)
    } finally {
      setLoading(false)
    }
  }, [filters.limit, fetchPosts])

  // Filter by published status
  const filterByPublished = useCallback((published: boolean | null) => {
    setFilters((prev: any) => ({
      ...prev,
      published,
      page: 1,
    }))
    setPaginationState(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  // Pagination handler
  const setPagination = useCallback((newPagination: { pageIndex: number; pageSize: number }) => {
    setPaginationState(newPagination)
    setFilters((prev: any) => ({
      ...prev,
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
    }))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      published: undefined,
      orderBy: 'publishedAt',
      order: 'desc',
    })
    setPaginationState({
      pageIndex: 0,
      pageSize: 10,
    })
  }, [])

  // Effects
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [fetchCategories, fetchTags])

  return {
    // Data
    posts,
    categories,
    tags,
    totalCount,
    
    // Loading states
    loading,
    formLoading,
    
    // Pagination
    pagination,
    
    // Filters
    filters,
    
    // Actions
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublishStatus,
    searchPosts,
    filterByCategory,
    filterByTag,
    filterByPublished,
    
    // Pagination handlers
    setPagination,
    
    // Reset functions
    resetFilters,
  }
}