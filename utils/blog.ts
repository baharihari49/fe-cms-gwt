// lib/utils/blog.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlogPost, BlogPostStats } from "@/components/blog/types/blog"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

/**
 * Calculate reading time based on content length
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Extract plain text from HTML content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Format post stats for display
 */
export function formatPostStats(stats: BlogPostStats): {
  views: string
  likes: string
  comments: string
  shares: string
} {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return {
    views: formatNumber(stats.views),
    likes: formatNumber(stats.likes),
    comments: formatNumber(stats.comments),
    shares: formatNumber(stats.shares),
  }
}

/**
 * Get post status with styling
 */
export function getPostStatus(post: BlogPost): {
  status: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
} {
  if (post.published) {
    return {
      status: 'Published',
      variant: 'default',
      className: 'bg-green-500 text-white'
    }
  }
  return {
    status: 'Draft',
    variant: 'outline',
    className: 'border-yellow-500 text-yellow-600'
  }
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = stripHtml(content)
  return truncateText(plainText, maxLength)
}

/**
 * Validate post data
 */
export function validatePostData(data: Partial<BlogPost>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Title is required')
  }

  if (!data.content?.trim()) {
    errors.push('Content is required')
  }

  if (!data.excerpt?.trim()) {
    errors.push('Excerpt is required')
  }

  if (!data.categoryId) {
    errors.push('Category is required')
  }

  if (!data.authorId) {
    errors.push('Author is required')
  }

  if (data.image && !isValidUrl(data.image)) {
    errors.push('Invalid image URL')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const postDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

/**
 * Sort posts by various criteria
 */
export function sortPosts(posts: BlogPost[], sortBy: string, order: 'asc' | 'desc' = 'desc'): BlogPost[] {
  return [...posts].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'publishedAt':
        aValue = new Date(a.publishedAt || 0)
        bValue = new Date(b.publishedAt || 0)
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'views':
        aValue = a.stats.views
        bValue = b.stats.views
        break
      case 'likes':
        aValue = a.stats.likes
        bValue = b.stats.likes
        break
      default:
        aValue = new Date(a.publishedAt || 0)
        bValue = new Date(b.publishedAt || 0)
    }

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * Filter posts by various criteria
 */
export function filterPosts(posts: BlogPost[], filters: {
  search?: string
  categoryId?: string
  tagId?: string
  published?: boolean
  featured?: boolean
}): BlogPost[] {
  return posts.filter(post => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableText = [
        post.title,
        post.excerpt,
        post.content,
        post.author.name,
        post.category.name,
        ...post.tags.map((t: { tag: { name: any } }) => t.tag.name)
      ].join(' ').toLowerCase()
      
      if (!searchableText.includes(searchTerm)) {
        return false
      }
    }

    // Category filter
    if (filters.categoryId && post.categoryId !== filters.categoryId) {
      return false
    }

    // Tag filter
    if (filters.tagId && !post.tags.some((t: { tagId: string | undefined }) => t.tagId === filters.tagId)) {
      return false
    }

    // Published filter
    if (filters.published !== undefined && post.published !== filters.published) {
      return false
    }

    // Featured filter
    if (filters.featured !== undefined && post.featured !== filters.featured) {
      return false
    }

    return true
  })
}

/**
 * Export posts to CSV
 */
export function exportPostsToCSV(posts: BlogPost[]): string {
  const headers = [
    'ID',
    'Title',
    'Slug',
    'Author',
    'Category',
    'Published',
    'Featured',
    'Views',
    'Likes',
    'Comments',
    'Shares',
    'Published At',
    'Created At'
  ]

  const rows = posts.map(post => [
    post.id,
    post.title,
    post.slug,
    post.author.name,
    post.category.name,
    post.published ? 'Yes' : 'No',
    post.featured ? 'Yes' : 'No',
    post.stats.views,
    post.stats.likes,
    post.stats.comments,
    post.stats.shares,
    post.publishedAt || '',
    post.createdAt
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  return csvContent
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string = 'blog-posts.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}