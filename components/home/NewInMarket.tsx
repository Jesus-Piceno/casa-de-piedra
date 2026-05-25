import { PropertyCard } from "@/components/ui/PropertyCard";
import { Property } from "@/app/[locale]/page";
import { Pagination } from "@/components/ui/Pagination";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface NewInMarketProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  typeFilter?: string | null;
  statusFilter?: string | null;
  searchQuery?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  beds?: number | null;
  baths?: number | null;
  amenities?: string | null;
}

/** Build a URL preserving all active filters, but overriding/removing status */
function buildStatusHref(
  status: string | null,
  props: NewInMarketProps
) {
  const params = new URLSearchParams();
  // status filter changes always reset to page 1
  if (status) params.set("status", status);
  if (props.typeFilter) params.set("type", props.typeFilter);
  if (props.searchQuery) params.set("q", props.searchQuery);
  if (props.minPrice) params.set("minPrice", String(props.minPrice));
  if (props.maxPrice) params.set("maxPrice", String(props.maxPrice));
  if (props.beds) params.set("beds", String(props.beds));
  if (props.baths) params.set("baths", String(props.baths));
  if (props.amenities) params.set("amenities", props.amenities);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export async function NewInMarket(props: NewInMarketProps) {
  const {
    properties,
    currentPage,
    totalPages,
    statusFilter,
  } = props;

  const t = await getTranslations("Home");

  const tabs: { label: string; status: string | null }[] = [
    { label: t("all"), status: null },
    { label: t("buy"), status: "FOR SALE" },
    { label: t("rent"), status: "FOR RENT" },
  ];

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t("newInMarket")}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t("newInMarketSubtitle")}
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.status;
            return (
              <Link
                key={tab.label}
                href={buildStatusHref(tab.status, props)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              currentPage={currentPage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <p className="text-nordic-muted text-sm">{t("noProperties")}</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        typeFilter={props.typeFilter}
        statusFilter={statusFilter}
        searchQuery={props.searchQuery}
        minPrice={props.minPrice}
        maxPrice={props.maxPrice}
        beds={props.beds}
        baths={props.baths}
        amenities={props.amenities}
      />
    </section>
  );
}
