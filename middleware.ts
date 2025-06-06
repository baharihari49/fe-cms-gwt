// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value || null

  // ------------------------------------------
  // 1) Jika user mengakses /login atau /register:
  //    • Jika sudah punya token → redirect ke /dashboard
  //    • Jika belum punya token → izinkan lanjut ke login/register
  // ------------------------------------------
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ------------------------------------------
  // 2) Untuk SEMUA route selain /login dan /register:
  //    • Jika belum login (token = null) → redirect ke /login?from=<pathname>
  //    • Jika sudah login             → izinkan (NextResponse.next())
  // ------------------------------------------
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // ------------------------------------------
  // 3) Jika sudah ada token → lanjutkan ke route yang diminta
  // ------------------------------------------
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Terapkan middleware ke semua path kecuali:
      - API routes (diawali "api")
      - Static files Next.js (diawali "_next/static" atau "_next/image")
      - Favicon
    */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
