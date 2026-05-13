import { FeaturedPropertyCard } from "@/components/ui/FeaturedPropertyCard";
import { Property } from "@/app/page";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedCollectionsProps {
  properties: Property[];
}

export function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
          <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
        </div>
        <Link className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
          View all <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map(property => (
          <FeaturedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
