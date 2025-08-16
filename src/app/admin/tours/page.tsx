import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import ToursManagement from '@/components/admin/ToursManagement';

export default async function ToursPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <ToursManagement />;
}