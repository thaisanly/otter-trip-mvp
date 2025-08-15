import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import CategoriesManagement from '@/components/admin/CategoriesManagement';

export default async function CategoriesPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <CategoriesManagement admin={admin} />;
}