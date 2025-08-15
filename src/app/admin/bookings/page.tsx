import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import BookingManagement from '@/components/admin/BookingManagement';

export default async function BookingsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <BookingManagement admin={admin} />;
}