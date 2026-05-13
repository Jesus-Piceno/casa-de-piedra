"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

export function MapWrapper({ locationName }: { locationName: string }) {
  return <PropertyMap locationName={locationName} />;
}
