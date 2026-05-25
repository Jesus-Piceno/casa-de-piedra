import Image from "next/image";
import Link from "next/link";
import { Building2, LogIn } from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from "@/utils/supabase/server";

export async function Navbar() {
  const t = await getTranslations('Navigation');
  const locale = await getLocale();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    isAdmin = roleData?.role === 'admin';
  }

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href={`/${locale}`}>{t('properties')}</Link>
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('about')}</Link>
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('contact')}</Link>
            {isAdmin && (
              <Link className="text-mosque hover:text-mosque/85 font-semibold text-sm hover:border-b-2 hover:border-mosque/20 px-1 py-1 transition-all" href={`/${locale}/admin`}>
                {t('adminDashboard')}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:block border-l border-nordic-dark/10 pl-4">
              <LanguageSelector />
            </div>

            {/* Conditional Profile / Auth display */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-nordic-dark/10 ml-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shadow-sm">
                  <Image
                    alt={user.user_metadata?.full_name || "Profile"}
                    className="w-full h-full object-cover"
                    src={user.user_metadata?.avatar_url || "/images/profile.jpg"}
                    width={36}
                    height={36}
                  />
                </div>
                <form action={`/${locale}/auth/signout`} method="post" className="hidden sm:block">
                  <button 
                    type="submit" 
                    className="text-xs font-semibold text-nordic-muted hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    {t('signOut')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="pl-2 border-l border-nordic-dark/10 ml-2">
                <Link 
                  href={`/${locale}/login`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-mosque hover:bg-mosque/90 rounded-lg shadow-sm transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {t('signIn')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu (hidden by default as per the html) */}
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href={`/${locale}`}>{t('properties')}</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('about')}</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('contact')}</Link>
          {isAdmin && (
            <Link className="block px-3 py-2 rounded-md text-base font-semibold text-mosque bg-mosque/10" href={`/${locale}/admin`}>
              {t('adminDashboard')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
