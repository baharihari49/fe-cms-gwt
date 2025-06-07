// components/blog/categories/utils/category-utils.ts

import { Category } from "@/components/blog/categories/types/categories"

/**
 * Generate slug from category name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate category name
 */
export function validateCategoryName(name: string, existingCategories: Category[] = [], excludeId?: string): string | null {
  if (!name.trim()) {
    return "Category name is required"
  }

  if (name.length < 2) {
    return "Category name must be at least 2 characters"
  }

  if (name.length > 100) {
    return "Category name must be less than 100 characters"
  }

  // Check for duplicate names
  const isDuplicate = existingCategories.some(
    cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
  )

  if (isDuplicate) {
    return "A category with this name already exists"
  }

  return null
}

/**
 * Validate category description
 */
export function validateCategoryDescription(description: string): string | null {
  if (!description.trim()) {
    return "Category description is required"
  }

  if (description.length < 10) {
    return "Category description must be at least 10 characters"
  }

  if (description.length > 500) {
    return "Category description must be less than 500 characters"
  }

  return null
}

/**
 * Get category statistics
 */
export function getCategoryStats(categories: Category[]) {
  const totalCategories = categories.length
  const totalPosts = categories.reduce((sum, cat) => sum + (cat._count?.posts || cat.postCount || 0), 0)
  const categoriesWithPosts = categories.filter(cat => (cat._count?.posts || cat.postCount || 0) > 0).length
  const emptyCategoriesCount = totalCategories - categoriesWithPosts

  return {
    totalCategories,
    totalPosts,
    categoriesWithPosts,
    emptyCategoriesCount,
    averagePostsPerCategory: totalCategories > 0 ? Math.round(totalPosts / totalCategories) : 0
  }
}

/**
 * Sort categories by various criteria
 */
export function sortCategories(categories: Category[], sortBy: 'name' | 'posts' | 'created' | 'updated' = 'name'): Category[] {
  return [...categories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'posts':
        const aCount = a._count?.posts || a.postCount || 0
        const bCount = b._count?.posts || b.postCount || 0
        return bCount - aCount // Descending order
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })
}

/**
 * Filter categories by search term
 */
export function filterCategories(categories: Category[], searchTerm: string): Category[] {
  if (!searchTerm.trim()) {
    return categories
  }

  const term = searchTerm.toLowerCase()
  return categories.filter(category =>
    category.name.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term) ||
    category.slug.toLowerCase().includes(term)
  )
}

/**
 * Get categories by post count range
 */
export function getCategoriesByPostCount(categories: Category[], min: number = 0, max?: number): Category[] {
  return categories.filter(category => {
    const postCount = category._count?.posts || category.postCount || 0
    if (max !== undefined) {
      return postCount >= min && postCount <= max
    }
    return postCount >= min
  })
}

/**
 * Get most popular categories
 */
export function getMostPopularCategories(categories: Category[], limit: number = 5): Category[] {
  return sortCategories(categories, 'posts').slice(0, limit)
}

/**
 * Get recently created categories
 */
export function getRecentCategories(categories: Category[], limit: number = 5): Category[] {
  return sortCategories(categories, 'created').slice(0, limit)
}

/**
 * Format category for display
 */
export function formatCategoryForDisplay(category: Category) {
  const postCount = category._count?.posts || category.postCount || 0
  const postText = postCount === 1 ? 'post' : 'posts'
  
  return {
    ...category,
    displayPostCount: `${postCount} ${postText}`,
    isPopular: postCount >= 10,
    isEmpty: postCount === 0,
    formattedCreatedAt: new Date(category.createdAt).toLocaleDateString(),
    formattedUpdatedAt: new Date(category.updatedAt).toLocaleDateString(),
  }
}