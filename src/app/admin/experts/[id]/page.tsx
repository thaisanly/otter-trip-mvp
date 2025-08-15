import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExpertDetailAdmin from '@/components/admin/ExpertDetailAdmin';

export default async function ExpertDetailPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const resolvedParams = await params;
  const expert = await prisma.expert.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!expert) {
    redirect('/admin/experts');
  }

  return <ExpertDetailAdmin expert={expert} admin={admin} />;
}