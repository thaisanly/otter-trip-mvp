import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function DashboardPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <AdminDashboard admin={admin} />;
}