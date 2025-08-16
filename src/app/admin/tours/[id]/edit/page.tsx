import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourForm from '@/components/admin/TourForm';

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id },
  });

  if (!tour) {
    redirect('/admin/tours');
  }

  // Transform Prisma Tour to component Tour interface
  const tourData = {
    id: tour.id,
    code: tour.code,
    title: tour.title,
    heroImage: tour.heroImage,
    duration: tour.duration,
    price: tour.price,
    totalJoined: tour.totalJoined,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    location: tour.location,
    categories: tour.categories as string[],
    overview: tour.overview as string[],
    highlights: tour.highlights as string[],
    contentImage: tour.contentImage ?? undefined,
    videoUrl: tour.videoUrl ?? undefined,
    galleryImages: tour.galleryImages as string[] ?? undefined,
    inclusions: tour.inclusions as string[] ?? undefined,
    exclusions: tour.exclusions as string[] ?? undefined,
    itinerary: tour.itinerary as Array<{
      day?: number | string;
      title?: string;
      description?: string;
      activities?: string;
      meals?: string[];
      accommodation?: string;
    }> ?? undefined,
    description: tour.description ?? undefined,
    groupSize: tour.groupSize ?? undefined,
    spotsLeft: tour.spotsLeft ?? undefined,
    tourLeaderId: tour.tourLeaderId ?? undefined,
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString()
  };

  return <TourForm mode="edit" tour={tourData} />;
}