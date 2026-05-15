"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MapPin, Minus, Plus, ChevronDown, ArrowRight } from "lucide-react";

/* ─────── Types ─────── */
interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FiltersState {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  beds: number;
  baths: number;
  amenities: Set<string>;
}

import { useTranslations } from "next-intl";

const AMENITIES = [
  { id: "pool", key: "pool", icon: "🏊" },
  { id: "gym", key: "gym", icon: "🏋️" },
  { id: "parking", key: "parking", icon: "🅿️" },
  { id: "ac", key: "ac", icon: "❄️" },
  { id: "wifi", key: "wifi", icon: "📶" },
  { id: "patio", key: "patio", icon: "🌿" },
];

const PROPERTY_TYPES = [
  "all",
  "house",
  "apartment",
  "villa",
  "penthouse",
  "studio",
  "townhouse",
  "condo",
];

const DEFAULT_FILTERS: FiltersState = {
  location: "",
  minPrice: "",
  maxPrice: "",
  propertyType: "Any Type",
  beds: 0,
  baths: 0,
  amenities: new Set<string>(),
};

import { useRouter, useSearchParams } from "next/navigation";

/* ─────── Component ─────── */
export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Filters');

  const [filters, setFilters] = useState<FiltersState>(() => ({
    location: searchParams.get("q") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    propertyType: searchParams.get("type") || "all",
    beds: parseInt(searchParams.get("beds") || "0", 10),
    baths: parseInt(searchParams.get("baths") || "0", 10),
    amenities: new Set<string>(),
  }));

  // Update internal state if URL changes while modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFilters({
        location: searchParams.get("q") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        propertyType: searchParams.get("type") || "all",
        beds: parseInt(searchParams.get("beds") || "0", 10),
        baths: parseInt(searchParams.get("baths") || "0", 10),
        amenities: new Set<string>(),
      });
    }
  }, [isOpen, searchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.location.trim()) params.set("q", filters.location.trim());
    else params.delete("q");

    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    else params.delete("minPrice");

    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    else params.delete("maxPrice");

    if (filters.propertyType !== "all") params.set("type", filters.propertyType);
    else params.delete("type");

    if (filters.beds > 0) params.set("beds", filters.beds.toString());
    else params.delete("beds");

    if (filters.baths > 0) params.set("baths", filters.baths.toString());
    else params.delete("baths");

    // Reset pagination on new filter
    params.delete("page");

    router.push(`/?${params.toString()}`);
    onClose();
  };

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* Helpers */
  const toggleAmenity = useCallback((id: string) => {
    setFilters((prev) => {
      const next = new Set(prev.amenities);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, amenities: next };
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, amenities: new Set() });
  }, []);

  const increment = (field: "beds" | "baths") =>
    setFilters((p) => ({ ...p, [field]: Math.min(p[field] + 1, 10) }));

  const decrement = (field: "beds" | "baths") =>
    setFilters((p) => ({ ...p, [field]: Math.max(p[field] - 1, 0) }));

  /* ── Price slider visual position ── */
  const minVal = parseInt(filters.minPrice.replace(/,/g, "")) || 0;
  const maxVal = parseInt(filters.maxPrice.replace(/,/g, "")) || 10_000_000;
  const PRICE_CEIL = 10_000_000;
  const leftPct = Math.min((minVal / PRICE_CEIL) * 100, 100);
  const rightPct = Math.min((maxVal / PRICE_CEIL) * 100, 100);

  const formatDisplayPrice = (min: string, max: string) => {
    const fmtNum = (v: string) => {
      const n = parseInt(v.replace(/,/g, ""));
      if (!n && n !== 0) return "$0";
      if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
      return `$${n}`;
    };
    const a = fmtNum(min || "0");
    const b = fmtNum(max || "10000000");
    return `${a} – ${b}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-nordic-dark/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <main
        role="dialog"
        aria-modal="true"
        aria-label="Property filters"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <header className="px-8 py-6 border-b border-nordic-dark/5 flex justify-between items-center bg-white sticky top-0 z-30">
            <h2 className="text-2xl font-semibold tracking-tight text-nordic-dark">
              {t('filters')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-nordic-dark/5 transition-colors text-nordic-muted"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto hide-scroll p-8 space-y-10">
            {/* Location */}
            <section>
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">
                {t('location')}
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-nordic-muted group-focus-within:text-mosque transition-colors" />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-clear-day border-0 rounded-lg text-nordic-dark placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none"
                  placeholder={t('locationPlaceholder')}
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
            </section>

            {/* Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                  {t('priceRange')}
                </label>
                <span className="text-sm font-medium text-mosque">
                  {formatDisplayPrice(filters.minPrice, filters.maxPrice)}
                </span>
              </div>

              {/* Visual slider track */}
              <div className="relative h-12 flex items-center mb-6 px-2">
                <div className="absolute w-full h-1 bg-nordic-dark/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-mosque"
                    style={{
                      marginLeft: `${leftPct}%`,
                      width: `${Math.max(rightPct - leftPct, 2)}%`,
                    }}
                  />
                </div>
                {/* Handles */}
                <div
                  className="absolute w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform z-10"
                  style={{ left: `${leftPct}%`, marginLeft: "-12px" }}
                />
                <div
                  className="absolute w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform z-10"
                  style={{ left: `${rightPct}%`, marginLeft: "-12px" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                    {t('minPrice')}
                  </label>
                  <div className="flex items-center">
                    <span className="text-nordic-muted mr-1">$</span>
                    <input
                      className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm outline-none"
                      type="text"
                      value={filters.minPrice}
                      placeholder="0"
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, minPrice: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                    {t('maxPrice')}
                  </label>
                  <div className="flex items-center">
                    <span className="text-nordic-muted mr-1">$</span>
                    <input
                      className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm outline-none"
                      type="text"
                      value={filters.maxPrice}
                      placeholder="10,000,000"
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                  {t('propertyType')}
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-clear-day border-0 rounded-lg py-3 pl-4 pr-10 text-nordic-dark appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none"
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        propertyType: e.target.value,
                      }))
                    }
                  >
                    {PROPERTY_TYPES.map((typeKey) => (
                      <option key={typeKey} value={typeKey}>{t(typeKey as any)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-nordic-muted pointer-events-none" />
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-nordic-dark">
                    {t('bedrooms')}
                  </span>
                  <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                    <button
                      onClick={() => decrement("beds")}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                      disabled={filters.beds <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {filters.beds === 0 ? "0" : `${filters.beds}+`}
                    </span>
                    <button
                      onClick={() => increment("beds")}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-nordic-dark">
                    {t('bathrooms')}
                  </span>
                  <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                    <button
                      onClick={() => decrement("baths")}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                      disabled={filters.baths <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {filters.baths === 0 ? "0" : `${filters.baths}+`}
                    </span>
                    <button
                      onClick={() => increment("baths")}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">
                {t('amenitiesFeatures')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => {
                  const active = filters.amenities.has(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`relative px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        active
                          ? "border-mosque bg-mosque/5 text-mosque font-medium"
                          : "border-nordic-dark/10 bg-white text-nordic-muted hover:border-nordic-dark/20"
                      }`}
                    >
                      <span className="text-lg">{amenity.icon}</span>
                      {t(amenity.key as any)}
                      {active && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Footer ── */}
          <footer className="bg-white border-t border-nordic-dark/5 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button
              onClick={clearAll}
              className="text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors underline decoration-nordic-dark/20 underline-offset-4"
            >
              {t('clearFilters')}
            </button>
            <button
              onClick={handleApplyFilters}
              className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 active:scale-95"
            >
              {t('showHomes')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </footer>
        </div>
      </main>
    </>
  );
}
