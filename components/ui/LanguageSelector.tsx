"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export function LanguageSelector() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <select
      defaultValue={locale}
      disabled={isPending}
      onChange={onSelectChange}
      className="bg-transparent border border-nordic-dark/10 rounded-md py-1 px-2 text-sm text-nordic-dark hover:border-mosque focus:outline-none focus:ring-2 focus:ring-mosque/20 transition-all cursor-pointer"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="fr">FR</option>
    </select>
  );
}
