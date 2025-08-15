import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TourLeaderForm from '@/components/admin/TourLeaderForm';

export default async function EditTourLeaderPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const tourLeader = await prisma.tourLeader.findUnique({
    where: { id: params.id },
  });

  if (!tourLeader) {
    redirect('/admin/tour-leaders');
  }

  return <TourLeaderForm admin={admin} mode="edit" tourLeader={tourLeader} />;
}