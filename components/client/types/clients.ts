// types/client.ts
export interface Client {
  id: number
  name: string
  industry: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClientRequest {
  name: string
  industry: string
  image?: string
  isActive?: boolean
}

export interface UpdateClientRequest {
  id: number
  name: string
  industry: string
  image?: string
  isActive?: boolean
}

export interface ClientsResponse {
  success: boolean
  data: Client[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ClientResponse {
  success: boolean
  data: Client
}

export interface DeleteClientResponse {
  success: boolean
  message: string
}
