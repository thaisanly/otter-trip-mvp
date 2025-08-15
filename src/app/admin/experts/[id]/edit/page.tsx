import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExpertForm from '@/components/admin/ExpertForm';

export default async function EditExpertPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const expert = await prisma.expert.findUnique({
    where: { id: params.id },
  });

  if (!expert) {
    redirect('/admin/experts');
  }

  return <ExpertForm admin={admin} mode="edit" expert={expert} />;
}