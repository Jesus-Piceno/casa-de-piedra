"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { FiltersModal } from "./FiltersModal";
import { useTranslations } from "next-intl";

const PROPERTY_TYPES = ["All", "House", "Apartment", "Villa", "Penthouse", "Studio"];

export function HeroSection() {
  const t = useTranslations('Hero');
  const tf = useTranslations('Filters');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "All";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    // Reset to page 1 on new search
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const handleTypeClick = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "All") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    // Reset to page 1 when changing type
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {t('titlePrefix', { fallback: 'Find your' })} <span className="relative inline-block">
            <span className="relative z-10 font-medium">{t('titleHighlight', { fallback: 'sanctuary' })}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>.
        </h1>
        
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-nordic-muted w-6 h-6 group-focus-within:text-mosque transition-colors" />
          </div>
          <input 
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg outline-none" 
            placeholder={t('searchPlaceholder')} 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
          >
            {tf('search')}
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === type
                  ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
                  : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
              }`}
            >
              {tf(type.toLowerCase() as any) || type}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> {tf('filters', { fallback: 'Filters' })}
          </button>
        </div>
      </div>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </section>
  );
}
