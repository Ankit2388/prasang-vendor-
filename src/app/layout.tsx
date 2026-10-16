import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';

export const metadata: Metadata = {
  title: 'Prasang Vendor Portal — Event & Catering Management',
  description:
    'Manage catering business profiles, event quotations, custom wedding menus, dishes catalog, and customer reviews on Prasang.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="prasang" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
