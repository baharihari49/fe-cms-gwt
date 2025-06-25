// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN';
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse {
  success: boolean;
  data?: User | User[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BulkDeleteRequest {
  ids: number[];
}