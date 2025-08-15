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

  return <TourLeaderDetailAdmin tourLeader={tourLeader} admin={admin} />;
}