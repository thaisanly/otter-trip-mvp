import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import TourForm from '@/components/admin/TourForm';

export default async function CreateTourPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <TourForm mode="create" />;
}