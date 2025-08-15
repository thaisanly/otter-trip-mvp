'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // For admin routes, render children directly without Header/Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For non-admin routes, include Header and Footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}