// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

// Daftar path yang tidak perlu autentikasi (public)
// PENTING: Jangan gunakan '/' saja karena akan match semua path dengan startsWith
const PUBLIC_PATHS = ['/login', '/register']

// Daftar path yang hanya boleh diakses jika sudah login (protected)
const PROTECTED_PATHS = ['/dashboard', '/profile', '/settings', '/admin']

// Fungsi helper untuk cek apakah path adalah public
function isPublicPath(pathname: string): boolean {
  // Cek exact match untuk root path
  if (pathname === '/') return true
  
  // Cek apakah pathname dimulai dengan salah satu public paths
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path))
}

// Fungsi helper untuk cek apakah path adalah protected
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Ambil cookie bernama 'token'
  const token = req.cookies.get('token')?.value || null

  console.log(`Middleware: ${pathname}, token: ${!!token}`) // Debug log

  // 1. Jika user sudah login (ada token) tetapi mencoba mengakses halaman login/register,
  //    redirect ke /dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    console.log(`Redirecting logged-in user from ${pathname} to /dashboard`)
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 2. Jika user belum login (tidak ada token) tetapi mencoba mengakses halaman protected,
  //    redirect ke /login
  if (!token && isProtectedPath(pathname)) {
    console.log(`Redirecting unauthenticated user from ${pathname} to /login`)
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    // Sertakan redirect URL asal sebagai query
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // 3. Untuk semua kasus lain, izinkan request lanjut
  return NextResponse.next()
}

/**
 * Konfigurasi: middleware hanya akan dijalankan pada route‐route yang didefinisikan.
 */
export const config = {
  // Exclude Next.js internal paths dan static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}