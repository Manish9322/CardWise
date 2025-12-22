
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

  // While settings are loading, we don't want to show the "Loading..." text.
  // The main page (`page.tsx`) will handle its own loading state with the intro animation.
  // For other pages, they might have their own loading states.
  // If maintenance mode is active, we show it immediately, even during the initial settings load.
  if (settingsData?.isMaintenanceMode && !pathname.startsWith('/admin')) {
    return <MaintenancePage />;
  }

  // If the settings are still loading, and we are on a non-admin, non-main page,
  // we can show a generic loading state or nothing, but for now we'll let the child render
  // and handle its own loading state. The main page already does this gracefully.
  if (isLoading && !pathname.startsWith('/admin') && pathname !== '/') {
      return (
        <div className="flex min-h-screen items-center justify-center">
          {/* This can be a more sophisticated skeleton loader if needed */}
        </div>
      );
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
        <link rel="icon" href="data:," />
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
