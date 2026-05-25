"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { Property } from "@/app/[locale]/admin/page";
import {
  X,
  Loader2,
  ImagePlus,
  Trash2,
} from "lucide-react";

/** Known amenity keys matching the Filters i18n namespace */
const AMENITY_KEYS = [
  "pool",
  "gym",
  "parking",
  "ac",
  "garden",
  "terrace",
  "fireplace",
  "concierge",
  "ev_charging",
  "solar",
] as const;

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "villa",
  "penthouse",
  "studio",
  "townhouse",
  "condo",
] as const;

interface PropertyFormModalProps {
  /** null → add mode, Property → edit mode */
  property: Property | null;
  onClose: () => void;
  onSaved: (saved: Property, isNew: boolean) => void;
  onDeleted?: (id: string) => void;
}

/** Generate a URL-safe slug from a title string */
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PropertyFormModal({
  property,
  onClose,
  onSaved,
  onDeleted,
}: PropertyFormModalProps) {
  const t = useTranslations("Admin");
  const tf = useTranslations("Filters");
  const supabase = createClient();

  const isEdit = property !== null;

  // ── Form state ──
  const [title, setTitle] = useState(property?.title ?? "");
  const [location, setLocation] = useState(property?.location ?? "");
  const [price, setPrice] = useState(property?.price?.toString() ?? "");
  const [status, setStatus] = useState(property?.status ?? "FOR SALE");
  const [type, setType] = useState(property?.type?.toLowerCase() ?? "house");
  const [beds, setBeds] = useState(property?.beds?.toString() ?? "3");
  const [baths, setBaths] = useState(property?.baths?.toString() ?? "2");
  const [area, setArea] = useState(property?.area?.toString() ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [imagesText, setImagesText] = useState(
    (property?.images ?? []).join("\n")
  );
  const [amenities, setAmenities] = useState<string[]>(
    property?.amenities ?? []
  );
  const [isFeatured, setIsFeatured] = useState(
    property?.is_featured ?? false
  );
  const [isNewArrival, setIsNewArrival] = useState(
    property?.is_new_arrival ?? false
  );
  const [isExclusive, setIsExclusive] = useState(
    property?.is_exclusive ?? false
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Auto-generate slug from title (only if user hasn't manually edited)
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Toggle an amenity in the selection
  const toggleAmenity = useCallback((key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }, []);

  // ── Validation ──
  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!title.trim()) newErrors.title = true;
    if (!location.trim()) newErrors.location = true;
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = true;
    if (!area.trim() || isNaN(Number(area)) || Number(area) <= 0) newErrors.area = true;
    if (!slug.trim()) newErrors.slug = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const galleryImages = imagesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        location: location.trim(),
        price: Number(price),
        status,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        beds: Number(beds),
        baths: Number(baths),
        area: Number(area),
        slug: slug.trim(),
        gallery_images: galleryImages,
        amenities,
        is_featured: isFeatured,
        is_new_arrival: isNewArrival,
        is_exclusive: isExclusive,
      };

      if (isEdit && property) {
        // UPDATE
        const { data, error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", property.id)
          .select()
          .single();

        if (error) throw error;

        const saved: Property = {
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price,
          status: data.status,
          type: data.type,
          images: data.gallery_images || [],
          beds: data.beds,
          baths: data.baths,
          area: data.area,
          slug: data.slug,
          is_featured: data.is_featured || false,
          is_new_arrival: data.is_new_arrival || false,
          is_exclusive: data.is_exclusive || false,
          amenities: data.amenities || [],
        };
        onSaved(saved, false);
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("properties")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        const saved: Property = {
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price,
          status: data.status,
          type: data.type,
          images: data.gallery_images || [],
          beds: data.beds,
          baths: data.baths,
          area: data.area,
          slug: data.slug,
          is_featured: data.is_featured || false,
          is_new_arrival: data.is_new_arrival || false,
          is_exclusive: data.is_exclusive || false,
          amenities: data.amenities || [],
        };
        onSaved(saved, true);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert(t("saveError") + `: ${err.message || ""}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handler ──
  const handleDelete = async () => {
    if (!property) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);

      if (error) throw error;
      onDeleted?.(property.id);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(t("deleteError") + `: ${err.message || ""}`);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // ── Input style helpers ──
  const inputBase =
    "w-full px-4 py-2.5 rounded-lg border bg-transparent text-nordic-dark dark:text-white placeholder-nordic-muted focus:outline-none focus:ring-1 focus:ring-mosque text-sm transition-all";
  const borderNormal =
    "border-nordic-dark/10 dark:border-mosque/30";
  const borderError = "border-red-400 dark:border-red-500";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-[#0f231f] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nordic-dark/5 dark:border-mosque/10">
          <h2 className="text-lg font-bold text-nordic-dark dark:text-white">
            {isEdit ? t("editProperty") : t("addProperty")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-nordic-dark/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-nordic-muted" />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* ── Title ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
              {t("propertyTitle")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputBase} ${errors.title ? borderError : borderNormal}`}
              placeholder="Modern Lakeside Villa"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{t("requiredField")}</p>
            )}
          </div>

          {/* ── Location ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
              {t("propertyLocation")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${inputBase} ${errors.location ? borderError : borderNormal}`}
              placeholder="Lake Como, Italy"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{t("requiredField")}</p>
            )}
          </div>

          {/* ── Price & Status (row) ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
                {t("propertyPrice")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`${inputBase} ${errors.price ? borderError : borderNormal}`}
                placeholder="750000"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{t("requiredField")}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
                {t("propertyStatus")}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${inputBase} ${borderNormal} cursor-pointer bg-white dark:bg-[#1a3833]`}
              >
                <option value="FOR SALE">{t("forSale")}</option>
                <option value="FOR RENT">{t("forRent")}</option>
              </select>
            </div>
          </div>

          {/* ── Type ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
              {t("propertyType")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${inputBase} ${borderNormal} cursor-pointer bg-white dark:bg-[#1a3833]`}
            >
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt.charAt(0).toUpperCase() + pt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* ── Beds, Baths, Area (row) ── */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
                {t("propertyBeds")}
              </label>
              <input
                type="number"
                min="0"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className={`${inputBase} ${borderNormal}`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
                {t("propertyBaths")}
              </label>
              <input
                type="number"
                min="0"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className={`${inputBase} ${borderNormal}`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
                {t("propertyArea")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={`${inputBase} ${errors.area ? borderError : borderNormal}`}
              />
              {errors.area && (
                <p className="text-xs text-red-500 mt-1">{t("requiredField")}</p>
              )}
            </div>
          </div>

          {/* ── Slug ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
              {t("propertySlug")}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className={`${inputBase} ${errors.slug ? borderError : borderNormal} font-mono text-xs`}
            />
            <p className="text-xs text-nordic-muted mt-1">{t("propertySlugHint")}</p>
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">{t("requiredField")}</p>
            )}
          </div>

          {/* ── Flags (checkboxes) ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-3">
              {t("details")}
            </label>
            <div className="flex flex-wrap gap-4">
              {([
                ["isFeatured", isFeatured, setIsFeatured],
                ["isNewArrival", isNewArrival, setIsNewArrival],
                ["isExclusive", isExclusive, setIsExclusive],
              ] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(
                ([key, val, setter]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() => setter(!val)}
                      className="w-4 h-4 rounded border-nordic-dark/20 text-mosque focus:ring-mosque cursor-pointer accent-mosque"
                    />
                    <span className="text-sm text-nordic-dark dark:text-gray-300 group-hover:text-mosque transition-colors">
                      {t(key as any)}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* ── Gallery Images ── */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-nordic-dark dark:text-white mb-1.5">
              <ImagePlus className="w-4 h-4 text-mosque" />
              {t("propertyImages")}
            </label>
            <textarea
              rows={4}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              className={`${inputBase} ${borderNormal} resize-none font-mono text-xs`}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
            />
            <p className="text-xs text-nordic-muted mt-1">{t("propertyImagesHint")}</p>
          </div>

          {/* ── Amenities ── */}
          <div>
            <label className="block text-sm font-semibold text-nordic-dark dark:text-white mb-3">
              {t("propertyAmenities")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-nordic-dark/5 dark:border-mosque/10 hover:border-mosque/30 transition-colors cursor-pointer select-none group"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(key)}
                    onChange={() => toggleAmenity(key)}
                    className="w-4 h-4 rounded border-nordic-dark/20 text-mosque focus:ring-mosque cursor-pointer accent-mosque"
                  />
                  <span className="text-sm text-nordic-dark dark:text-gray-300 group-hover:text-mosque transition-colors">
                    {tf(key as any)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-nordic-dark/5 dark:border-mosque/10 flex items-center gap-3">
          {/* Delete button (only in edit mode) */}
          {isEdit && onDeleted && (
            <div className="mr-auto">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 dark:text-red-400 max-w-[200px]">
                    {t("deleteConfirm")}
                  </span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {deleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      t("deleteProperty")
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-xs font-semibold border border-nordic-dark/10 dark:border-mosque/30 rounded-lg hover:bg-nordic-dark/5 transition-colors cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t("deleteProperty")}
                </button>
              )}
            </div>
          )}

          <div className={`flex items-center gap-3 ${!isEdit ? "ml-auto" : ""}`}>
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold border border-nordic-dark/10 dark:border-mosque/30 rounded-lg text-nordic-dark dark:text-white hover:bg-nordic-dark/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold bg-mosque hover:bg-mosque/90 text-white rounded-lg shadow-lg shadow-mosque/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? t("saving") : t("saveProperty")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
