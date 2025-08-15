import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import ExpertForm from '@/components/admin/ExpertForm';

export default async function CreateExpertPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <ExpertForm admin={admin} mode="create" />;
}