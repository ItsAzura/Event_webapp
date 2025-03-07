import type { Metadata } from 'next';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';

export const metadata: Metadata = {
  title: 'EventHub - Find and Join Amazing Events',
  description: 'Discover and join amazing events in your area',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
