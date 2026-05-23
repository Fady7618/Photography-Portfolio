import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './src/lib/supabase-middleware'

export async function middleware(request: NextRequest) {
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
