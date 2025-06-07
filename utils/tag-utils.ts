// components/blog/tags/utils/tag-utils.ts

import { Tag } from "@/components/blog/tags/types/tags"

/**
 * Generate slug from tag name
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
 * Validate tag name
 */
export function validateTagName(name: string, existingTags: Tag[] = [], excludeId?: string): string | null {
  if (!name.trim()) {
    return "Tag name is required"
  }

  if (name.length < 2) {
    return "Tag name must be at least 2 characters"
  }

  if (name.length > 50) {
    return "Tag name must be less than 50 characters"
  }

  // Check for duplicate names
  const isDuplicate = existingTags.some(
    tag => tag.name.toLowerCase() === name.toLowerCase() && tag.id !== excludeId
  )

  if (isDuplicate) {
    return "A tag with this name already exists"
  }

  return null
}

/**
 * Get tag statistics
 */
export function getTagStats(tags: Tag[]) {
  const totalTags = tags.length
  const totalPosts = tags.reduce((sum, tag) => sum + (tag._count?.posts || tag.postCount || 0), 0)
  const tagsWithPosts = tags.filter(tag => (tag._count?.posts || tag.postCount || 0) > 0).length
  const unusedTagsCount = totalTags - tagsWithPosts

  return {
    totalTags,
    totalPosts,
    tagsWithPosts,
    unusedTagsCount,
    averagePostsPerTag: totalTags > 0 ? Math.round(totalPosts / totalTags) : 0
  }
}

/**
 * Sort tags by various criteria
 */
export function sortTags(tags: Tag[], sortBy: 'name' | 'posts' | 'created' | 'updated' = 'name'): Tag[] {
  return [...tags].sort((a, b) => {
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
 * Filter tags by search term
 */
export function filterTags(tags: Tag[], searchTerm: string): Tag[] {
  if (!searchTerm.trim()) {
    return tags
  }

  const term = searchTerm.toLowerCase()
  return tags.filter(tag =>
    tag.name.toLowerCase().includes(term) ||
    tag.slug.toLowerCase().includes(term)
  )
}

/**
 * Get tags by post count range
 */
export function getTagsByPostCount(tags: Tag[], min: number = 0, max?: number): Tag[] {
  return tags.filter(tag => {
    const postCount = tag._count?.posts || tag.postCount || 0
    if (max !== undefined) {
      return postCount >= min && postCount <= max
    }
    return postCount >= min
  })
}

/**
 * Get most popular tags
 */
export function getMostPopularTags(tags: Tag[], limit: number = 10): Tag[] {
  return sortTags(tags, 'posts').slice(0, limit)
}

/**
 * Get recently created tags
 */
export function getRecentTags(tags: Tag[], limit: number = 10): Tag[] {
  return sortTags(tags, 'created').slice(0, limit)
}

/**
 * Get unused tags (tags with no posts)
 */
export function getUnusedTags(tags: Tag[]): Tag[] {
  return tags.filter(tag => {
    const postCount = tag._count?.posts || tag.postCount || 0
    return postCount === 0
  })
}

/**
 * Format tag for display
 */
export function formatTagForDisplay(tag: Tag) {
  const postCount = tag._count?.posts || tag.postCount || 0
  const postText = postCount === 1 ? 'post' : 'posts'
  
  return {
    ...tag,
    displayPostCount: `${postCount} ${postText}`,
    isPopular: postCount >= 5,
    isEmpty: postCount === 0,
    formattedCreatedAt: new Date(tag.createdAt).toLocaleDateString(),
    formattedUpdatedAt: new Date(tag.updatedAt).toLocaleDateString(),
  }
}

/**
 * Group tags by first letter
 */
export function groupTagsByLetter(tags: Tag[]): Record<string, Tag[]> {
  const grouped: Record<string, Tag[]> = {}
  
  tags.forEach(tag => {
    const firstLetter = tag.name.charAt(0).toUpperCase()
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = []
    }
    grouped[firstLetter].push(tag)
  })
  
  // Sort each group
  Object.keys(grouped).forEach(letter => {
    grouped[letter] = sortTags(grouped[letter], 'name')
  })
  
  return grouped
}

/**
 * Convert tags array to hashtag string
 */
export function tagsToHashtags(tags: Tag[]): string {
  return tags.map(tag => `#${tag.slug}`).join(' ')
}

/**
 * Parse hashtag string to tag names
 */
export function hashtagsToTagNames(hashtags: string): string[] {
  return hashtags
    .split(/\s+/)
    .filter(tag => tag.startsWith('#'))
    .map(tag => tag.slice(1)) // Remove # symbol
    .filter(tag => tag.length > 0)
}