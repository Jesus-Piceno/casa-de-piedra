import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params;
  const { locale } = params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/${locale}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/${locale}${next}`);
      } else {
        return NextResponse.redirect(`${origin}/${locale}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth-code-error`);
}
