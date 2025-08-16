import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import BookingDetailView from '@/components/admin/BookingDetailView';

interface BookingDetailPageProps {
  params: Promise<{
    reference: string;
  }>;
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const admin = await getCurrentAdmin();
  const { reference } = await params;

  if (!admin) {
    redirect('/admin');
  }

  return <BookingDetailView bookingReference={reference} />;
}