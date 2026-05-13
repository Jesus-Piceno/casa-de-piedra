import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { 
  MapPin, Star, MessageCircle, Phone, Calendar, Mail, 
  Grid2X2, Square, BedDouble, Bath, Car, CheckCircle2,
  ArrowRight, ArrowLeft, Calculator
} from "lucide-react";

import { MapWrapper } from "@/components/ui/MapWrapper";

export default async function PropertyDetailsPage(props: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  
  const fromPage = searchParams?.fromPage as string | undefined;
  const backUrl = fromPage ? `/?page=${fromPage}` : "/";
  
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !property) {
    notFound();
  }

  // Obtener hasta 7 imágenes de la galería
  const allImages: string[] = (property.gallery_images || []).slice(0, 7);

  const isForSale = property.status === "FOR SALE";

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={backUrl} className="inline-flex items-center gap-2 text-sm font-medium text-nordic-dark/70 hover:text-mosque transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to properties
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Columna Izquierda: Imágenes */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <Image
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={allImages[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                fill
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.is_exclusive && (
                  <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Premium
                  </span>
                )}
                {property.is_new_arrival && (
                  <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    New
                  </span>
                )}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                <Grid2X2 className="w-4 h-4" />
                View all photos
              </button>
            </div>
            
            {/* Galería (Miniaturas) */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
                {allImages.slice(1).map((img, idx) => (
                  <div key={idx} className="flex-none w-48 aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity snap-start">
                    <Image
                      alt={`${property.title} - Photo ${idx + 2}`}
                      className="w-full h-full object-cover"
                      src={img}
                      fill
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Tarjeta de Precio y Agente */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-nordic-dark mb-2">
                    {property.title}
                  </h1>
                  <div className="text-4xl font-display font-light text-mosque mb-4">
                    ${property.price.toLocaleString()}
                    {!isForSale && <span className="text-xl text-nordic-muted">/mo</span>}
                  </div>
                  <p className="text-nordic-dark/60 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-mosque" />
                    {property.location}
                  </p>
                </div>
                
                <div className="h-px bg-slate-100 my-6"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 relative rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      alt="Agente Inmobiliario"
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Featured Agent</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Schedule a Tour
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Agent
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                  <MapWrapper locationName={property.location} />
                  <div className="absolute bottom-2 right-2 z-[1000]">
                    <a className="bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic-dark hover:text-mosque" href="#">View on Map</a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Fila Inferior: Detalles */}
        <div className="lg:col-span-8 lg:w-2/3 space-y-8">
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Square className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">Sq Meters</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <BedDouble className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Bath className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Car className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">2</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">Garage</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark">About the property</h2>
            <div className="prose prose-slate max-w-none text-nordic-dark/70 leading-relaxed">
              <p className="mb-4">
                Experience modern luxury in this architecturally stunning home. 
                Designed with a focus on indoor-outdoor living, the residence features 
                floor-to-ceiling glass walls that flood the interiors with natural light.
              </p>
              <p>
                An excellent opportunity to settle in one of the best areas, combining 
                security, comfort, and an unmatched lifestyle.
              </p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Smart Home System",
                "Private Pool",
                "Central Heating & Air",
                "EV Charger",
                "Private Gym",
                "Wine Cellar"
              ].map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-nordic-dark/70">
                  <CheckCircle2 className="w-4 h-4 text-mosque/60" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {isForSale && (
            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">Estimated Monthly Payment</h3>
                  <p className="text-sm text-nordic-dark/60">
                    Starting at <strong className="text-mosque">${Math.floor(property.price * 0.005).toLocaleString()}/mo</strong> with 20% down
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
                Calculate Mortgage
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Simple Footer Placeholder */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-nordic-dark/50 text-center">
          © 2026 LuxeEstate Inc. All rights reserved.
        </div>
      </footer>
    </>
  );
}
