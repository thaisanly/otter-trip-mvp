import { prisma } from '@/lib/prisma';
import ExploreClient from './page-client';
import { notFound } from 'next/navigation';

export default async function ExplorePage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  
  // Fetch category from database
  const categoryFromDb = await prisma.tourCategory.findUnique({
    where: { 
      id: category,
      isActive: true 
    }
  });

  // If category doesn't exist or is inactive, show 404
  if (!categoryFromDb) {
    notFound();
  }

  // Fetch tours from database based on category with tour leader information
  let tours = [];
  try {
    const dbTours = await prisma.$queryRaw`
      SELECT t.*, tl.id as leader_id, tl.name as leader_name, tl.image as leader_image
      FROM tours t
      LEFT JOIN tour_leaders tl ON t."tourLeaderId" = tl.id
      WHERE t.categories::jsonb @> ${JSON.stringify([category])}::jsonb
      ORDER BY t.rating DESC
    ` as any[];

    // Transform tours to match the expected format
    tours = dbTours.map(tour => ({
      id: tour.id,
      title: tour.title,
      image: tour.heroImage,
      location: tour.location,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      price: tour.price,
      duration: tour.duration,
      description: tour.description || (Array.isArray(tour.overview) ? tour.overview[0] : ''),
      totalJoined: tour.totalJoined,
      categories: tour.categories as string[],
      dates: tour.dates || [],
      hasAvailableDates: tour.dates && Array.isArray(tour.dates) && tour.dates.length > 0,
      tourLeader: tour.leader_id ? {
        id: tour.leader_id,
        name: tour.leader_name,
        image: tour.leader_image
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching tours:', error);
    // Continue with empty tours array
  }

  // Transform category data to match expected format
  const currentCategoryData = {
    title: categoryFromDb.name,
    description: categoryFromDb.description,
    image: categoryFromDb.coverImage,
    interests: Array.isArray(categoryFromDb.interests) ? categoryFromDb.interests as string[] : []
  };

  return (
    <ExploreClient 
      category={category}
      categoryData={currentCategoryData}
      tours={tours}
    />
  );
}