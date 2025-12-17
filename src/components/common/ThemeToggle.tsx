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
      onClick={() => dispatch(toggleTheme())}
      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
