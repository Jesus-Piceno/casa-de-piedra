import Image from "next/image";
import { BedDouble, Bath, Square, Heart } from "lucide-react";
import { Property } from "@/app/page";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const isForSale = property.status === "FOR SALE";
  
  return (
    <article className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrl}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark">
          <Heart className="w-4 h-4" />
        </button>
        <div className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${isForSale ? "bg-nordic-dark/90" : "bg-mosque/90"}`}>
          {property.status}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            ${property.price.toLocaleString()}
            {!isForSale && <span className="text-sm font-normal text-nordic-muted">/mo</span>}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">{property.title}</h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <BedDouble className="w-3.5 h-3.5 text-mosque/80" /> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <Bath className="w-3.5 h-3.5 text-mosque/80" /> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <Square className="w-3.5 h-3.5 text-mosque/80" /> {property.area}m²
          </div>
        </div>
      </div>
    </article>
  );
}
