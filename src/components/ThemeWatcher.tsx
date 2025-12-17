'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';

export default function ThemeWatcher() {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
