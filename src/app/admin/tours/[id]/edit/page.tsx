import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourForm from '@/components/admin/TourForm';

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
  });

  if (!tour) {
    redirect('/admin/tours');
  }

  return <TourForm admin={admin} mode="edit" tour={tour} />;
}