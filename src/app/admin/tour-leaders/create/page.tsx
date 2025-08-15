import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import TourLeaderForm from '@/components/admin/TourLeaderForm';

export default async function CreateTourLeaderPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <TourLeaderForm admin={admin} mode="create" />;
}