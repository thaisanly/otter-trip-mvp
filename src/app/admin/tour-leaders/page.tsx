import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import TourLeadersManagement from '@/components/admin/TourLeadersManagement';

export default async function TourLeadersPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <TourLeadersManagement admin={admin} />;
}