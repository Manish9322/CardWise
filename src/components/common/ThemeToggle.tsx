'use client';

import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleTheme } from '@/lib/store/features/theme/themeSlice';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => dispatch(toggleTheme())}
      className="h-9 w-9"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
