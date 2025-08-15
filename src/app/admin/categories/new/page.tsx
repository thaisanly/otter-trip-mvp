import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import CategoryForm from '@/components/admin/CategoryForm';

export default async function NewCategoryPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <CategoryForm isNew={true} />;
}