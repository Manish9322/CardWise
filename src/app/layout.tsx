
'use client';

import './globals.css';
import StoreProvider from '@/lib/store/provider';
import ThemeWatcher from '@/components/ThemeWatcher';
import { Toaster } from '@/components/ui/toaster';
import { useAppSelector } from '@/lib/store/hooks';
import MaintenancePage from '@/components/common/MaintenancePage';
import { usePathname } from 'next/navigation';
import { useGetSettingsQuery } from '@/utils/services/api';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMaintenanceMode } from '@/lib/store/features/app/appSlice';

function AppContent({ children }: { children: React.ReactNode }) {
  const isMaintenanceMode = useAppSelector((state) => state.app.isMaintenanceMode);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { data: settingsData, isLoading, isSuccess } = useGetSettingsQuery(undefined, {
    skip: pathname.startsWith('/admin'), // Don't fetch on admin routes
  });

  useEffect(() => {
    if (isSuccess && settingsData) {
      dispatch(setMaintenanceMode(settingsData.isMaintenanceMode));
    }
  }, [settingsData, isSuccess, dispatch]);

  if (isLoading && !pathname.startsWith('/admin')) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      );
  }

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
