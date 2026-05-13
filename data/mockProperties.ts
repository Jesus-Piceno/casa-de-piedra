export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio';
export type PropertyStatus = 'FOR SALE' | 'FOR RENT';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  images: string[];
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
    images: [], 5,
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
    images: [], 3,
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
    images: [], 3,
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
    images: [], 1,
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
    images: [], 2,
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
    images: [], 3,
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
    images: [], 1,
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
    images: [], 2,
    baths: 2,
    area: 110,
  },
  {
    id: '9',
    title: 'Coastal Haven',
    location: '101 Beach Blvd, Malibu',
    price: 4200000,
    status: 'FOR SALE',
    type: 'House',
    images: [], 4,
    baths: 3.5,
    area: 320,
    isFeatured: true,
  },
  {
    id: '10',
    title: 'Downtown Condo',
    location: '202 Market St, San Francisco',
    price: 3500, // Monthly
    status: 'FOR RENT',
    type: 'Apartment',
    images: [], 2,
    baths: 2,
    area: 95,
  },
  {
    id: '11',
    title: 'Sunset Penthouse',
    location: '303 Ocean Ave, Santa Monica',
    price: 8900000,
    status: 'FOR SALE',
    type: 'Penthouse',
    images: [], 3,
    baths: 4,
    area: 450,
    isExclusive: true,
  },
  {
    id: '12',
    title: 'Suburban Family Home',
    location: '404 Maple Dr, Denver',
    price: 650000,
    status: 'FOR SALE',
    type: 'House',
    images: [], 4,
    baths: 2.5,
    area: 280,
    isNewArrival: true,
  },
  {
    id: '13',
    title: 'Minimalist Studio',
    location: '505 Arts Dist, Los Angeles',
    price: 2200, // Monthly
    status: 'FOR RENT',
    type: 'Studio',
    images: [], 1,
    baths: 1,
    area: 55,
  },
  {
    id: '14',
    title: 'Luxury Waterfront Villa',
    location: '606 Bay View, Miami Beach',
    price: 12500000,
    status: 'FOR SALE',
    type: 'Villa',
    images: [], 6,
    baths: 7,
    area: 850,
    isFeatured: true,
    isExclusive: true,
  },
  {
    id: '15',
    title: 'Historic Brownstone',
    location: '707 Park Ave, New York',
    price: 5400000,
    status: 'FOR SALE',
    type: 'House',
    images: [], 5,
    baths: 4,
    area: 320,
  },
  {
    id: '16',
    title: 'Riverside Apartment',
    location: '808 River Walk, San Antonio',
    price: 2800, // Monthly
    status: 'FOR RENT',
    type: 'Apartment',
    images: [], 2,
    baths: 2,
    area: 88,
    isNewArrival: true,
  },
  {
    id: '17',
    title: 'Eco-Friendly Modern Home',
    location: '909 Green St, Portland',
    price: 890000,
    status: 'FOR SALE',
    type: 'House',
    images: [], 3,
    baths: 2.5,
    area: 165,
    isFeatured: true,
  },
  {
    id: '18',
    title: 'City View Loft',
    location: '1010 Skyline Dr, Atlanta',
    price: 750000,
    status: 'FOR SALE',
    type: 'Studio',
    images: [], 1,
    baths: 1.5,
    area: 110,
  }
];
