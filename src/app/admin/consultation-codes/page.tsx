import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import ConsultationCodesAdmin from '../../../components/admin/ConsultationCodes';

export default async function ConsultationCodesPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return <ConsultationCodesAdmin admin={admin} />;
}