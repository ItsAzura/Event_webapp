import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register page',
};

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
