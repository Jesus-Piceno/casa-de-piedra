export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio';
export type PropertyStatus = 'FOR SALE' | 'FOR RENT';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  imageUrl: string;
  beds: number;
  baths: number;
  area: number; // en metros cuadrados
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isExclusive?: boolean;
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: 5250000,
    status: 'FOR SALE',
    type: 'Villa',
    imageUrl: '/images/glass-pavilion.jpg',
    beds: 5,
    baths: 4.5,
    area: 4200,
    isFeatured: true,
    isExclusive: true,
  },
  {
    id: '2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: 3800000,
    status: 'FOR SALE',
    type: 'Penthouse',
    imageUrl: '/images/azure-heights.jpg',
    beds: 3,
    baths: 3,
    area: 2100,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    id: '3',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: 850000,
    status: 'FOR SALE',
    type: 'House',
    imageUrl: '/images/modern-family-home.jpg',
    beds: 3,
    baths: 2,
    area: 120,
  },
  {
    id: '4',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: 3200, // Monthly
    status: 'FOR RENT',
    type: 'Apartment',
    imageUrl: '/images/urban-loft.jpg',
    beds: 1,
    baths: 1,
    area: 85,
  },
  {
    id: '5',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: 620000,
    status: 'FOR SALE',
    type: 'House',
    imageUrl: '/images/highland-retreat.jpg',
    beds: 2,
    baths: 2,
    area: 98,
  },
  {
    id: '6',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: 4500, // Monthly
    status: 'FOR RENT',
    type: 'Penthouse',
    imageUrl: '/images/sea-view-penthouse.jpg',
    beds: 3,
    baths: 3,
    area: 180,
  },
  {
    id: '7',
    title: 'Central Studio',
    location: '555 Main St, Chicago',
    price: 550000,
    status: 'FOR SALE',
    type: 'Studio',
    imageUrl: '/images/central-studio.jpg',
    beds: 1,
    baths: 1,
    area: 50,
  },
  {
    id: '8',
    title: 'Garden Villa',
    location: '999 Oak Ln, Austin',
    price: 2800, // Monthly
    status: 'FOR RENT',
    type: 'Villa',
    imageUrl: '/images/garden-villa.jpg',
    beds: 2,
    baths: 2,
    area: 110,
  }
];
