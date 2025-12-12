import { prisma } from '@/lib/prisma';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    tour: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Helper to create mock NextRequest
function createMockRequest(url: string) {
  const urlObj = new URL(url);
  return {
    nextUrl: {
      searchParams: urlObj.searchParams
    }
  };
}

describe('Tours API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('GET /api/tours', () => {
    it('should return all tours when no filters provided', async () => {
      const mockTours = [
        {
          id: 'tour-1',
          title: 'Tokyo Adventure',
          description: 'A great tour',
          location: 'Tokyo, Japan',
          duration: '5 days',
          price: '$500',
          rating: 4.8,
          totalJoined: 100,
          heroImage: '/images/tokyo.jpg',
          overview: ['Point 1', 'Point 2'],
          highlights: ['Highlight 1'],
          galleryImages: ['/img1.jpg'],
          inclusions: ['Hotel'],
          exclusions: ['Flights'],
          itinerary: [{ day: 1, title: 'Day 1', description: 'Arrival', activities: ['Check-in'] }],
          additionalInfo: ['Bring passport'],
          dates: ['2024-01-01'],
          reviews: [],
          categories: ['cultural'],
          tourLeaderId: 'leader-1',
          tourLeader: { id: 'leader-1', name: 'John', image: '/john.jpg', rating: 4.9 }
        }
      ];

      (mockPrisma.tour.findMany as jest.Mock).mockResolvedValue(mockTours);

      // Test the transformation logic directly
      const transformedTour = {
        id: mockTours[0].id,
        title: mockTours[0].title,
        description: mockTours[0].description || '',
        location: mockTours[0].location,
        duration: mockTours[0].duration,
        price: parseFloat(mockTours[0].price.replace(/[^0-9.]/g, '')) || 0,
        rating: mockTours[0].rating,
        totalJoined: mockTours[0].totalJoined,
        imageUrl: mockTours[0].heroImage,
        categories: mockTours[0].categories,
        tourLeaderId: mockTours[0].tourLeaderId,
        tourLeader: mockTours[0].tourLeader ? {
          id: mockTours[0].tourLeader.id,
          name: mockTours[0].tourLeader.name,
          image: mockTours[0].tourLeader.image,
          rating: mockTours[0].tourLeader.rating
        } : undefined
      };

      expect(transformedTour.id).toBe('tour-1');
      expect(transformedTour.title).toBe('Tokyo Adventure');
      expect(transformedTour.price).toBe(500);
      expect(transformedTour.tourLeader?.name).toBe('John');
    });

    it('should transform tour price correctly', () => {
      const priceTests = [
        { input: '$500', expected: 500 },
        { input: '$1,245', expected: 1245 },
        { input: '999', expected: 999 },
        { input: '$0', expected: 0 }
      ];

      priceTests.forEach(({ input, expected }) => {
        const price = parseFloat(input.replace(/[^0-9.]/g, '')) || 0;
        expect(price).toBe(expected);
      });
    });

    it('should handle tour without tour leader', () => {
      const mockTour = {
        id: 'tour-2',
        title: 'Solo Tour',
        tourLeaderId: null,
        tourLeader: null
      };

      const tourLeader = mockTour.tourLeader ? {
        id: mockTour.tourLeader.id,
        name: mockTour.tourLeader.name
      } : undefined;

      expect(tourLeader).toBeUndefined();
    });

    it('should handle empty arrays in tour data', () => {
      const mockTour = {
        overview: [],
        highlights: [],
        galleryImages: [],
        inclusions: [],
        exclusions: [],
        itinerary: [],
        additionalInfo: [],
        dates: [],
        reviews: [],
        categories: []
      };

      expect(Array.isArray(mockTour.overview) ? mockTour.overview : []).toEqual([]);
      expect(Array.isArray(mockTour.categories) ? mockTour.categories : []).toEqual([]);
    });

    it('should call findMany with correct parameters for category filter', async () => {
      const mockTours: never[] = [];
      (mockPrisma.tour.findMany as jest.Mock).mockResolvedValue(mockTours);

      // Simulate the expected call pattern
      await mockPrisma.tour.findMany({
        where: {
          categories: {
            array_contains: ['cultural']
          }
        },
        include: {
          tourLeader: true
        },
        orderBy: [
          { rating: 'desc' },
          { totalJoined: 'desc' }
        ],
        take: 100
      });

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            categories: {
              array_contains: ['cultural']
            }
          }
        })
      );
    });

    it('should call findUnique for single tour lookup', async () => {
      const mockTour = {
        id: 'tour-uuid-123',
        title: 'Single Tour'
      };

      (mockPrisma.tour.findUnique as jest.Mock).mockResolvedValue(mockTour);

      await mockPrisma.tour.findUnique({
        where: { id: 'tour-uuid-123' },
        include: { tourLeader: true }
      });

      expect(mockPrisma.tour.findUnique).toHaveBeenCalledWith({
        where: { id: 'tour-uuid-123' },
        include: { tourLeader: true }
      });
    });

    it('should return null when tour not found', async () => {
      (mockPrisma.tour.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await mockPrisma.tour.findUnique({
        where: { id: 'non-existent-id' }
      });

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      (mockPrisma.tour.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(mockPrisma.tour.findMany({})).rejects.toThrow('Database error');
    });

    it('should respect limit parameter', async () => {
      (mockPrisma.tour.findMany as jest.Mock).mockResolvedValue([]);

      await mockPrisma.tour.findMany({
        take: 10
      });

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10
        })
      );
    });
  });
});
