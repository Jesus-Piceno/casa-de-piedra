import { FeaturedPropertyCard } from "@/components/ui/FeaturedPropertyCard";
import { Property } from "@/app/page";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface FeaturedCollectionsProps {
  properties: Property[];
}

export async function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  const t = await getTranslations('Home');

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">{t('featuredCollections')}</h2>
          <p className="text-nordic-muted mt-1 text-sm">{t('featuredCollectionsSubtitle')}</p>
        </div>
        <Link className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
          {t('viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {properties.map(property => (
            <FeaturedPropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <p className="text-nordic-muted text-sm">{t('noFeatured')}</p>
        </div>
      )}
    </section>
  );
}
