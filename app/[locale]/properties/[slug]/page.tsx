import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations('PropertyDetails');
  const tf = await getTranslations('Filters');
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  
  // Rebuild the back URL preserving ALL active filters from searchParams
  const backParams = new URLSearchParams();
  const allowedKeys = ['page', 'q', 'type', 'minPrice', 'maxPrice', 'beds', 'baths', 'amenities'];
  for (const key of allowedKeys) {
    const val = searchParams?.[key];
    if (val && typeof val === 'string') backParams.set(key, val);
  }
  const backQuery = backParams.toString();
  const backUrl = backQuery ? `/?${backQuery}` : "/";
  
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
            {t('back')}
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
                    {t('premium')}
                  </span>
                )}
                {property.is_new_arrival && (
                  <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {t('new')}
                  </span>
                )}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                <Grid2X2 className="w-4 h-4" />
                {t('viewAllPhotos')}
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
                    {!isForSale && <span className="text-xl text-nordic-muted">{t('mo')}</span>}
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
                      <span>{t('featuredAgent')}</span>
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
                    {t('scheduleTour')}
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    {t('contactAgent')}
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                  <MapWrapper locationName={property.location} />
                  <div className="absolute bottom-2 right-2 z-[1000]">
                    <a className="bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic-dark hover:text-mosque" href="#">{t('viewOnMap')}</a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Fila Inferior: Detalles */}
        <div className="lg:col-span-8 lg:w-2/3 space-y-8">
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{t('features')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Square className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{t('sqMeters')}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <BedDouble className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{t('bedrooms')}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Bath className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{t('bathrooms')}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <Car className="w-6 h-6 text-mosque mb-2" />
                <span className="text-xl font-bold text-nordic-dark">2</span>
                <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{t('garage')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark">{t('aboutProperty')}</h2>
            <div className="prose prose-slate max-w-none text-nordic-dark/70 leading-relaxed">
              <p className="mb-4">{property.description || t('fallbackDescription')}</p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              {t('readMore')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{t('amenities')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {(property.amenities || []).map((amenity: string, idx: number) => {
                const translated = tf.has(amenity as any) ? tf(amenity as any) : amenity;
                return (
                  <div key={idx} className="flex items-center gap-3 text-nordic-dark/70">
                    <CheckCircle2 className="w-4 h-4 text-mosque/60" />
                    <span className="capitalize">{translated}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {isForSale && (
            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">{t('estimatedMonthlyPayment')}</h3>
                  <p className="text-sm text-nordic-dark/60">
                    {t('startingAt')} <strong className="text-mosque">${Math.floor(property.price * 0.005).toLocaleString()}{t('mo')}</strong> {t('withDownPayment')}
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
                {t('calculateMortgage')}
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
