import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import BookingDetailView from '@/components/admin/BookingDetailView';

interface BookingDetailPageProps {
  params: {
    reference: string;
  };
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <BookingDetailView admin={admin} bookingReference={params.reference} />;
}