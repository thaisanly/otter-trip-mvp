import { prisma } from '@/lib/prisma';
import TourDetailClient from './page-client';
import { notFound } from 'next/navigation';

export default async function TourDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Fetch tour from database with tour leader information
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      tourLeader: true // Include the related tour leader
    }
  });

  // If tour doesn't exist, show 404
  if (!tour) {
    notFound();
  }

  // Fetch similar tours (same category or location)
  let similarTours = [];
  try {
    // Get tours with overlapping categories
    const categories = tour.categories as string[];
    if (categories && categories.length > 0) {
      const dbTours = await prisma.$queryRaw`
        SELECT * FROM tours 
        WHERE id != ${id}
        AND categories::jsonb ?| ${categories}
        ORDER BY rating DESC
        LIMIT 6
      ` as any[];
      
      similarTours = dbTours.map(t => ({
        id: t.id,
        title: t.title,
        heroImage: t.heroImage,
        location: t.location,
        rating: t.rating,
        reviewCount: t.reviewCount,
        price: t.price,
        duration: t.duration,
        overview: t.overview || [],
        categories: t.categories as string[]
      }));
    }
    
    // If not enough similar tours, get any other tours
    if (similarTours.length < 3) {
      // Get IDs of tours we already have
      const existingIds = [id, ...similarTours.map(t => t.id)];
      
      const additionalTours = await prisma.tour.findMany({
        where: {
          id: { 
            notIn: existingIds 
          }
        },
        orderBy: { rating: 'desc' },
        take: 3 - similarTours.length
      });
      
      const formattedAdditional = additionalTours.map(t => ({
        id: t.id,
        title: t.title,
        heroImage: t.heroImage,
        location: t.location,
        rating: t.rating,
        reviewCount: t.reviewCount,
        price: t.price,
        duration: t.duration,
        overview: t.overview || [],
        categories: t.categories as string[]
      }));
      
      similarTours = [...similarTours, ...formattedAdditional];
    }
    
    // Ensure we have unique tours by filtering duplicates (as a safety measure)
    const uniqueTours = new Map();
    similarTours.forEach(tour => {
      if (!uniqueTours.has(tour.id)) {
        uniqueTours.set(tour.id, tour);
      }
    });
    similarTours = Array.from(uniqueTours.values());
  } catch (error) {
    console.error('Error fetching similar tours:', error);
  }

  // Transform tour data to include breadcrumb and ensure all fields exist
  // Use tour leader data if available, otherwise fall back to guide data or defaults
  const guideData = tour.tourLeader ? {
    id: tour.tourLeader.id,
    name: tour.tourLeader.name,
    image: tour.tourLeader.image,
    experience: tour.tourLeader.experience || '10+ years',
    bio: tour.tourLeader.bio || tour.tourLeader.description || 'Our experienced local guide will ensure you have an amazing journey.',
    specialties: Array.isArray(tour.tourLeader.expertise) ? tour.tourLeader.expertise : ['Local Culture', 'History', 'Adventure'],
    languages: Array.isArray(tour.tourLeader.languages) ? tour.tourLeader.languages : ['English']
  } : (tour.guide || {
    id: 'default',
    name: 'Expert Guide',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    experience: '10+ years',
    bio: 'Our experienced local guide will ensure you have an amazing journey.',
    specialties: ['Local Culture', 'History', 'Adventure'],
    languages: ['English', 'Local Language']
  });

  const tourWithExtras = {
    ...tour,
    breadcrumb: ['Home', 'Tours', tour.title],
    overview: tour.overview || [],
    highlights: tour.highlights || [],
    galleryImages: tour.galleryImages || [],
    inclusions: tour.inclusions || [],
    exclusions: tour.exclusions || [],
    itinerary: tour.itinerary || [],
    additionalInfo: tour.additionalInfo || [],
    dates: tour.dates || [],
    guide: guideData,
    reviews: tour.reviews || []
  };

  return (
    <TourDetailClient 
      tour={tourWithExtras}
      similarTours={similarTours}
    />
  );
}