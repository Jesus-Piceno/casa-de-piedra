import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first to get the localized response
  let response = handleI18n(request);

  // 2. Create Supabase client linked to the request and the localized response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Refresh session if expired
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en|fr)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
