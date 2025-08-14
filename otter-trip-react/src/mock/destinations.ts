export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  guideCount: number;
}

export const destinations: Destination[] = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 48,
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 32,
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 56,
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    country: 'South Africa',
    image:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 29,
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 67,
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    image:
      'https://images.unsplash.com/photo-1597212618440-806262de4f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    guideCount: 41,
  },
];
