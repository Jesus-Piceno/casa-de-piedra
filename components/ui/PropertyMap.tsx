"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js/Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function PropertyMap({ locationName }: { locationName: string }) {
  // In a real application, you would use Geocoding to get lat/lng from locationName
  // or store coordinates in your Supabase database. For now, we use a fixed mock coordinate.
  const position: [number, number] = [37.4419, -122.1430]; // Palo Alto

  return (
    <div className="w-full h-full min-h-[300px] z-0 relative rounded-lg overflow-hidden bg-slate-100">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full absolute inset-0 z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            {locationName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
