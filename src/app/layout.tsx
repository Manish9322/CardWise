'use client';

import './globals.css';
import StoreProvider from '@/lib/store/provider';
import ThemeWatcher from '@/components/ThemeWatcher';
import { Toaster } from '@/components/ui/toaster';
import { useAppSelector } from '@/lib/store/hooks';
import MaintenancePage from '@/components/common/MaintenancePage';
import { usePathname } from 'next/navigation';

function AppContent({ children }: { children: React.ReactNode }) {
  const isMaintenanceMode = useAppSelector((state) => state.app.isMaintenanceMode);
  const pathname = usePathname();

  // Maintenance mode should not affect the admin panel
  if (isMaintenanceMode && !pathname.startsWith('/admin')) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <title>CardWise</title>
        <meta name="description" content="A simple and fun guess card application." />
      </head>
      <body className="font-body antialiased">
        <StoreProvider>
          <ThemeWatcher />
          <AppContent>{children}</AppContent>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
