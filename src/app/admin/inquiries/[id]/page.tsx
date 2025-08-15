import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import InquiryDetailAdmin from '@/components/admin/InquiryDetailAdmin';

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
  });

  if (!inquiry) {
    redirect('/admin/inquiries');
  }

  return <InquiryDetailAdmin inquiry={inquiry} admin={admin} />;
}