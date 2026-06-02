import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'
import {
  checkRateLimit,
  getClientIp,
  rateLimitConfigs,
} from '@/lib/rate-limit'

function applyRateLimit(
  request: NextRequest,
  pathname: string,
  configKey: keyof typeof rateLimitConfigs
): NextResponse | null {
  if (request.method !== 'POST') return null

  const config = rateLimitConfigs[configKey]
  const ip = getClientIp(request)
  const key = `${configKey}:${ip}:${pathname}`
  const { allowed, retryAfterSeconds } = checkRateLimit(key, config)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      }
    )
  }

  return null
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/api/bookings') {
    const rateLimited = applyRateLimit(request, pathname, 'bookings')
    if (rateLimited) return rateLimited
  }

  if (pathname === '/api/admin/sessions/upload') {
    const rateLimited = applyRateLimit(request, pathname, 'upload')
    if (rateLimited) return rateLimited
  }

  const { supabaseResponse, user, supabase } = await updateSession(request)

  const url = request.nextUrl.clone()

  if (
    url.pathname.startsWith('/auth/login') ||
    url.pathname.startsWith('/auth/register')
  ) {
    if (user) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (url.pathname.startsWith('/reservation')) {
    if (!user) {
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
