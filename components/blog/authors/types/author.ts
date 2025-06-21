// components/authors/types/author.ts
export interface Author {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

export interface CreateAuthorRequest {
  name: string
  email: string
  bio?: string
  avatar?: string
}

export interface UpdateAuthorRequest extends CreateAuthorRequest {
  id: string
}

export interface AuthorsResponse {
  success: boolean
  authors: Author[]
}

export interface AuthorResponse {
  success: boolean
  data: Author
}

export interface DeleteAuthorResponse {
  success: boolean
  message: string
}