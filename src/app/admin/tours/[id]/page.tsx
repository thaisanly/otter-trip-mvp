import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourDetailAdmin from '@/components/admin/TourDetailAdmin';

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Transform Prisma Tour to match component's expected type
  const tourData = {
    ...tour,
    categories: tour.categories as string[],
    overview: tour.overview as string[],
    highlights: tour.highlights as string[],
    galleryImages: tour.galleryImages as string[] ?? [],
    inclusions: tour.inclusions as string[] ?? [],
    exclusions: tour.exclusions as string[] ?? [],
    itinerary: tour.itinerary as Array<{
      day?: string | number;
      title?: string;
      description?: string;
      meals?: string[];
      accommodation?: string;
    }> ?? [],
    description: tour.description ?? undefined,
    contentImage: tour.contentImage ?? undefined,
    videoUrl: tour.videoUrl ?? undefined,
    groupSize: tour.groupSize ?? undefined,
    spotsLeft: tour.spotsLeft ?? undefined,
    tourLeaderId: tour.tourLeaderId ?? undefined,
    dates: tour.dates as Array<{
      id?: string;
      date?: string;
      price?: number;
      spotsLeft?: number;
    }> ?? [],
    reviews: tour.reviews as Array<{
      id?: string;
      rating?: number;
      comment?: string;
    }> ?? [],
    additionalInfo: tour.additionalInfo ?? [],
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString()
  };

  return <TourDetailAdmin tour={tourData} />;
}