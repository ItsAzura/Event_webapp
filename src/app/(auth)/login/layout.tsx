import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Page',
  description: 'Login page',
};

export default async function LoginLayout({
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
