import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExpertForm from '@/components/admin/ExpertForm';

export default async function EditExpertPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const { id } = await params;
  const expert = await prisma.expert.findUnique({
    where: { id },
  });

  if (!expert) {
    redirect('/admin/experts');
  }

  return <ExpertForm mode="edit" expert={{
    id: expert.id,
    name: expert.name,
    title: expert.title,
    image: expert.image,
    banner: expert.banner ?? undefined,
    location: expert.location,
    rating: expert.rating,
    reviewCount: expert.reviewCount,
    hourlyRate: expert.hourlyRate,
    languages: expert.languages as string[],
    expertise: expert.expertise as string[],
    certifications: expert.certifications as string[] | undefined,
    availability: expert.availability as Record<string, { available: boolean; start: string; end: string }> | undefined,
    bio: expert.bio ?? undefined,
    experience: expert.experience ?? undefined,
    createdAt: expert.createdAt.toISOString(),
    updatedAt: expert.updatedAt.toISOString()
  }} />;
}