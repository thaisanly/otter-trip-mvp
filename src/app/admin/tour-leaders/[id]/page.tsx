import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourLeaderDetailAdmin from '@/components/admin/TourLeaderDetailAdmin';

export default async function TourLeaderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const { id } = await params;

  const tourLeader = await prisma.tourLeader.findUnique({
    where: { id },
  });

  if (!tourLeader) {
    redirect('/admin/tour-leaders');
  }

  // Transform Prisma TourLeader to component TourLeader interface
  const tourLeaderData = {
    id: tourLeader.id,
    name: tourLeader.name,
    image: tourLeader.image,
    coverImage: tourLeader.coverImage ?? undefined,
    location: tourLeader.location,
    rating: tourLeader.rating,
    reviewCount: tourLeader.reviewCount,
    specialty: tourLeader.specialty,
    tourCompleteCount: tourLeader.tourCompleteCount ?? undefined,
    averageResponseTime: tourLeader.averageResponseTime ?? undefined,
    description: tourLeader.description,
    price: tourLeader.price,
    isSuperhost: tourLeader.isSuperhost,
    languages: tourLeader.languages as string[],
    experience: tourLeader.experience ?? undefined,
    certifications: tourLeader.certifications as Array<{
      id?: string;
      title: string;
      description: string;
      isVerified: boolean;
      icon?: string;
    }> ?? undefined,
    bio: tourLeader.bio ?? undefined,
    expertise: tourLeader.expertise as string[] ?? undefined,
    tours: undefined,
    reviews: tourLeader.reviews as Array<{
      id: string;
      rating: number;
      comment: string;
    }> ?? undefined,
    availability: tourLeader.availability as Record<string, {
      available: boolean;
      start: string;
      end: string;
    }> ?? undefined,
    videoUrl: undefined,
    createdAt: tourLeader.createdAt.toISOString(),
    updatedAt: tourLeader.updatedAt.toISOString()
  };

  return <TourLeaderDetailAdmin tourLeader={tourLeaderData} />;
}