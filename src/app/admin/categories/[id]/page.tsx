import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CategoryDetailAdmin from '@/components/admin/CategoryDetailAdmin';

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  const { id } = await params;
  const category = await prisma.tourCategory.findUnique({
    where: { id },
  });

  if (!category) {
    redirect('/admin/categories');
  }

  return <CategoryDetailAdmin category={{
    ...category,
    icon: category.icon ?? undefined,
    interests: category.interests as string[],
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  }} />;
}