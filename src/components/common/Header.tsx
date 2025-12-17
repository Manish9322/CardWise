'use client';

import Link from 'next/link';
import { Menu, LogIn, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith('/profile');

  if (isProfilePage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          CardWise
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link href="/" className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
                <LayoutDashboard className="h-5 w-5" />
                <span>Play</span>
              </Link>
               <Link href="/profile" className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </Link>
              <Link href="/admin" className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
                <LogIn className="h-5 w-5" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
