// types/blog.ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  featured: boolean
  published: boolean
  readTime: string
  authorId: string
  categoryId: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  author: Author
  category: Category
  tags: BlogPostTag[]
  stats: BlogPostStats
  comments: Comment[]
  seoTitle: string | undefined
  seoDescription: string | undefined
}

export interface Author {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

export interface BlogPostTag {
  postId: string
  tagId: string
  tag: Tag
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface BlogPostStats {
  id: string
  postId: string
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  postId: string
  parentId: string | null
  createdAt: string
  updatedAt: string
  replies?: Comment[]
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface BlogPostResponse {
  success: boolean
  post: BlogPost
}

export interface CreatePostRequest {
  title: string
  excerpt: string
  content: string
  image?: string
  featured?: boolean
  authorId: string
  categoryId: string
  tags?: string[]
  readTime: string
  published?: boolean
  seoTitle?: string | undefined
  seoDescription?: string | undefined
}

export interface UpdatePostRequest {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  featured?: boolean
  authorId: string
  categoryId: string
  tags?: string[]
  readTime: string
  published?: boolean
  seoTitle?: string | undefined
  seoDescription?: string | undefined
}

export interface PartialUpdatePostRequest {
  id: string
  title?: string
  excerpt?: string
  content?: string
  image?: string
  featured?: boolean
  published?: boolean
  authorId?: string
  categoryId?: string
  tags?: string[]
  readTime?: string
}


export interface DeletePostResponse {
  success: boolean
  message: string
}

export interface PostFilters {
  page?: number
  limit?: number
  published?: boolean
  orderBy?: string
  order?: 'asc' | 'desc'
  search?: string
  categoryId?: string
  tagId?: string
  authorId?: string
}