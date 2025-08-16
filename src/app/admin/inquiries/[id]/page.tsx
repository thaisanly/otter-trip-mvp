import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import InquiryDetailAdmin from '@/components/admin/InquiryDetailAdmin';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!inquiry) {
    redirect('/admin/inquiries');
  }

  return <InquiryDetailAdmin inquiry={{
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? undefined,
    destination: inquiry.destination,
    preferredDate: inquiry.preferredDate ?? undefined,
    tripDuration: inquiry.tripDuration ?? undefined,
    message: inquiry.message ?? undefined,
    status: inquiry.status,
    createdAt: inquiry.createdAt.toISOString(),
    updatedAt: inquiry.updatedAt.toISOString()
  }} />;
}