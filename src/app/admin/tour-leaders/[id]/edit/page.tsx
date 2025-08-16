import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourLeaderForm from '@/components/admin/TourLeaderForm';

export default async function EditTourLeaderPage({ params }: { params: Promise<{ id: string }> }) {
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

  return <TourLeaderForm mode="edit" tourLeader={{
    id: tourLeader.id,
    name: tourLeader.name,
    image: tourLeader.image,
    location: tourLeader.location,
    rating: tourLeader.rating,
    reviewCount: tourLeader.reviewCount,
    specialty: tourLeader.specialty,
    description: tourLeader.description,
    languages: tourLeader.languages as string[],
    experience: tourLeader.experience ?? undefined,
    certifications: (tourLeader.certifications as Array<{
      id: string;
      title: string;
      description: string;
      isVerified: boolean;
      icon?: string;
    }>) || [],
    bio: tourLeader.bio ?? undefined,
    expertise: (tourLeader.expertise as string[]) || [],
    tours: [],
    reviews: (tourLeader.reviews as Array<{
      id: string;
      rating: number;
      comment: string;
    }>) || [],
    availability: tourLeader.availability as Record<string, {
      available: boolean;
      start: string;
      end: string;
    }> | undefined,
    createdAt: tourLeader.createdAt.toISOString(),
    updatedAt: tourLeader.updatedAt.toISOString()
  }} />;
}