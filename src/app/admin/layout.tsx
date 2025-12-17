'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LogOut,
  Users,
  PanelLeft,
  BookCopy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/actions/authActions';
import { useAppDispatch } from '@/lib/store/hooks';
import { setAuthenticated } from '@/lib/store/features/auth/authSlice';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function SidebarToggle() {
    const { state, toggleSidebar } = useSidebar();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9", state === "collapsed" && "mx-auto")}
                    onClick={toggleSidebar}
                >
                    <PanelLeft className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
                {state === 'expanded' ? 'Collapse' : 'Expand'}
            </TooltipContent>
        </Tooltip>
    )
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthenticated(true));
  }, [dispatch]);

  const handleLogout = async () => {
    await logout();
    dispatch(setAuthenticated(false));
  };
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-2">
            <Link href="/admin" className="text-xl font-bold text-primary pl-2 group-data-[collapsible=icon]:hidden">
              CardWise
            </Link>
            <SidebarToggle />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'} tooltip="Dashboard">
                <Link href="/admin"><Home /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/manage-questions'} tooltip="Manage Questions">
                <Link href="/admin/manage-questions"><BookCopy /><span>Manage Questions</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/manage-users'} tooltip="Manage Users">
                <Link href="/admin/manage-users"><Users /><span>Manage Users</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <form action={handleLogout} className="w-full">
             <SidebarMenuButton asChild tooltip="Logout">
                <button type="submit" className="w-full"><LogOut /><span>Logout</span></button>
            </SidebarMenuButton>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
