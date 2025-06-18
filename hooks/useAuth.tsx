// hooks/useAuth.tsx
'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Pastikan ENV di .env.local ada:
// NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Fungsi bantuan untuk mengatur / membaca cookie
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string  // diasumsikan backend mengirim ISO string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

export interface LogoutResult {
  success: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<LoginResult>
  logout: () => Promise<LogoutResult>
  refreshAuth: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // 1) Fetch user info dari endpoint /api/auth/me
  const fetchUser = async (): Promise<boolean> => {
    try {
      // Ambil token dari cookie
      const token = getCookie('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers,
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user as User)
        return true
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Fetch user error:', err)
      setUser(null)
    }
    return false
  }

  // 2) Coba refresh token di endpoint /api/auth/refresh
  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      // Biasanya endpoint refresh hanya perlu cookie lama, 
      // backend akan mengembalikan token baru di body
      const token = getCookie('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.token) {
          // Simpan token baru ke cookie
          setCookie('token', data.token)
          return true
        }
      }
    } catch (err) {
      console.error('Refresh token failed:', err)
    }
    return false
  }

  // 3) Fungsi login
  const login = async ({
    email,
    password,
  }: LoginCredentials): Promise<LoginResult> => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // untuk menerima Set-Cookie jika backend mengirim HttpOnly cookie
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Jika backend mengembalikan token di response
        if (data.token) {
          setCookie('token', data.token)
        }
        if (data.user) {
          setUser(data.user as User)
        }
        return { success: true }
      }
      return { success: false, error: data.error || 'Login failed' }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  // 4) Fungsi logout
  const logout = async (): Promise<LogoutResult> => {
    try {
      const token = getCookie('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers,
      })
      // Hapus cookie 'token' baik backend sudah menghapus atau tidak
      deleteCookie('token')
      setUser(null)
      router.push('/login')
      return { success: res.ok }
    } catch (err) {
      console.error('Logout error:', err)
      return { success: false }
    }
  }

  // 5) Refresh state auth: panggil fetchUser, jika gagal → tryRefreshToken → fetchUser lagi
  const refreshAuth = async (): Promise<void> => {
    setLoading(true)
    const ok = await fetchUser()
    if (!ok) {
      const didRefresh = await tryRefreshToken()
      if (didRefresh) {
        await fetchUser()
      }
    }
    setLoading(false)
  }

  // 6) Cek role
  const hasRole = (role: string): boolean => {
    return !!user && user.role === role
  }

  const isAuthenticated = !!user

  // 7) Saat komponen mount, jalankan refreshAuth
  useEffect(() => {
    refreshAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshAuth, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
