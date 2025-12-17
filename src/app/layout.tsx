import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/lib/store/provider';
import ThemeWatcher from '@/components/ThemeWatcher';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'CardWise',
  description: 'A simple and fun guess card application.',
};

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
      </head>
      <body className="font-body antialiased">
        <StoreProvider>
          <ThemeWatcher />
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
