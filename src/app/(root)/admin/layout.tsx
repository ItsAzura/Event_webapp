import type { Metadata } from 'next';
import AdminSidebar from '@/components/Shared/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin ',
  description: 'Admin page',
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminSidebar />
      <main>{children}</main>
    </>
  );
}
