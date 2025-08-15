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

  return <TourDetailAdmin tour={tour} admin={admin} />;
}