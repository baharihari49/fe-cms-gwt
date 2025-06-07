// hooks/use-tags.ts
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { blogTagAPI } from "@/lib/api/blog-tags"
import { Tag, CreateTagRequest, UpdateTagRequest } from "@/components/blog/tags/types/tags"

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch all tags
  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await blogTagAPI.getAllTags()
      if (response.success) {
        setTags(response.tags)
      }
    } catch (error) {
      toast.error("Failed to fetch tags")
      console.error("Error fetching tags:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create tag
  const createTag = async (data: CreateTagRequest): Promise<Tag | null> => {
    try {
      setActionLoading(true)
      const response = await blogTagAPI.createTag(data)
      if (response.success) {
        setTags(prev => [...prev, response.tag])
        toast.success("Tag created successfully")
        return response.tag
      }
      return null
    } catch (error: any) {
      toast.error(error.message || "Failed to create tag")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Update tag
  const updateTag = async (id: string, data: UpdateTagRequest): Promise<Tag | null> => {
    try {
      setActionLoading(true)
      const response = await blogTagAPI.updateTag(id, data)
      if (response.success) {
        setTags(prev => 
          prev.map(tag => 
            tag.id === id ? response.tag : tag
          )
        )
        toast.success("Tag updated successfully")
        return response.tag
      }
      return null
    } catch (error: any) {
      toast.error(error.message || "Failed to update tag")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Delete tag
  const deleteTag = async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true)
      const response = await blogTagAPI.deleteTag(id)
      if (response.success) {
        setTags(prev => prev.filter(tag => tag.id !== id))
        toast.success("Tag deleted successfully")
        return true
      }
      return false
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tag")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Get tag by ID
  const getTagById = (id: string): Tag | undefined => {
    return tags.find(tag => tag.id === id)
  }

  // Get tag by slug
  const getTagBySlug = (slug: string): Tag | undefined => {
    return tags.find(tag => tag.slug === slug)
  }

  // Get tags by name (search)
  const searchTags = (query: string): Tag[] => {
    if (!query.trim()) return tags
    
    const lowercaseQuery = query.toLowerCase()
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowercaseQuery) ||
      tag.slug.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Get most popular tags
  const getPopularTags = (limit: number = 10): Tag[] => {
    return [...tags]
      .sort((a, b) => {
        const countA = a._count?.posts || a.postCount || 0
        const countB = b._count?.posts || b.postCount || 0
        return countB - countA
      })
      .slice(0, limit)
  }

  // Get tags with no posts
  const getUnusedTags = (): Tag[] => {
    return tags.filter(tag => {
      const postCount = tag._count?.posts || tag.postCount || 0
      return postCount === 0
    })
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags,
    loading,
    actionLoading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagBySlug,
    searchTags,
    getPopularTags,
    getUnusedTags,
  }
}