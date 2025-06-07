// hooks/use-categories.ts
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { blogCategoryAPI } from "@/lib/api/blog-category"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/components/blog/categories/types/categories"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await blogCategoryAPI.getAllCategories()
      if (response.success) {
        setCategories(response.categories)
      }
    } catch (error) {
      toast.error("Failed to fetch categories")
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create category
  const createCategory = async (data: CreateCategoryRequest): Promise<Category | null> => {
    try {
      setActionLoading(true)
      const response = await blogCategoryAPI.createCategory(data)
      if (response.success) {
        setCategories(prev => [...prev, response.category])
        toast.success("Category created successfully")
        return response.category
      }
      return null
    } catch (error: any) {
      toast.error(error.message || "Failed to create category")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Update category
  const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category | null> => {
    try {
      setActionLoading(true)
      const response = await blogCategoryAPI.updateCategory(id, data)
      if (response.success) {
        setCategories(prev => 
          prev.map(cat => 
            cat.id === id ? response.category : cat
          )
        )
        toast.success("Category updated successfully")
        return response.category
      }
      return null
    } catch (error: any) {
      toast.error(error.message || "Failed to update category")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Delete category
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true)
      const response = await blogCategoryAPI.deleteCategory(id)
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
        toast.success("Category deleted successfully")
        return true
      }
      return false
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id)
  }

  // Get category by slug
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find(cat => cat.slug === slug)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    actionLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryBySlug,
  }
}