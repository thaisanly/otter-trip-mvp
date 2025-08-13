export interface TourDate {
  id: string;
  start: string;
  end: string;
  spotsLeft: number;
}

export interface BookingTour {
  id: string;
  title: string;
  guideId: string;
  guideName: string;
  guideImage: string;
  location: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  groupSize: number;
  spotsLeft: number;
  included: string[];
  notIncluded: string[];
  availableDates: TourDate[];
}

export const tour: BookingTour = {
  id: 'trip1',
  title: 'Hidden Waterfalls & Rice Terraces',
  guideId: '1',
  guideName: 'Sarah Johnson',
  guideImage:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  location: 'Bali, Indonesia',
  image:
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
  description:
    "Explore Bali's most beautiful hidden waterfalls and rice terraces on this 3-day adventure. You'll trek through lush jungles, swim in pristine natural pools, and experience authentic village life away from the tourist crowds.",
  price: 245,
  duration: '3 days',
  groupSize: 6,
  spotsLeft: 3,
  included: [
    'Professional guide',
    'Transportation',
    'Lunch and snacks',
    'Entrance fees',
    'Photography assistance',
  ],
  notIncluded: ['Accommodation', 'Breakfast and dinner', 'Personal expenses', 'Travel insurance'],
  availableDates: [
    {
      id: 'date1',
      start: 'Jun 15, 2023',
      end: 'Jun 17, 2023',
      spotsLeft: 3,
    },
    {
      id: 'date2',
      start: 'Jun 22, 2023',
      end: 'Jun 24, 2023',
      spotsLeft: 6,
    },
    {
      id: 'date3',
      start: 'Jul 5, 2023',
      end: 'Jul 7, 2023',
      spotsLeft: 2,
    },
  ],
};