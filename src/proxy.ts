import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './lib/i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  return matchLocale(languages, locales, i18n.defaultLocale)
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    [
      '/manifest.json',
      '/favicon.ico',
      '/sitemap.xml',
      '/robots.txt',
      // your other files in public
    ].includes(pathname)
  )
    return

  // Authentication Protection for /admin routes
  // Check if path involves admin but is not a public auth page (login/register)
  const isLoginPage = pathname.includes('/admin/login');
  const isRegisterPage = pathname.includes('/admin/register');
  const isAdminPath = pathname.includes('/admin');

  if (isAdminPath && !isLoginPage && !isRegisterPage) {
    const session = request.cookies.get('session');
    if (!session) {
      // Redirect to login
      let locale: string = i18n.defaultLocale;
      // Try to extract locale from path if present
      const pathLocale = pathname.split('/')[1];
      if ((i18n.locales as unknown as string[]).includes(pathLocale)) {
        locale = pathLocale;
      } else {
        // Otherwise guess locale
        locale = getLocale(request) || i18n.defaultLocale;
      }

      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|favicon|docs|sitemap.xml|robots.txt|.*\\..*).*)'
  ],
}
