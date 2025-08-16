import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import ExpertsManagement from '@/components/admin/ExpertsManagement';

export default async function ExpertsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <ExpertsManagement />;
}