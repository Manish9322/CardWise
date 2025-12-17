'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  LogOut,
  BookCopy,
  HelpCircle,
  Users,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
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

function SidebarToggle() {
    const { state, toggleSidebar } = useSidebar();
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", state === "collapsed" && "mx-auto")}
            onClick={toggleSidebar}
        >
            <PanelLeft className="h-4 w-4" />
        </Button>
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
        <SidebarHeader>
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <Link href="/admin" className="text-xl font-bold text-primary pl-2 group-data-[collapsible=icon]:hidden">
              CardWise
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'} tooltip={{ children: "Dashboard" }}>
                <Link href="/admin"><Home /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/manage-questions'} tooltip={{ children: "Manage Questions" }}>
                <Link href="/admin/manage-questions"><HelpCircle /><span>Manage Questions</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/manage-users'} tooltip={{ children: "Manage Users" }}>
                <Link href="/admin/manage-users"><Users /><span>Manage Users</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/cards/new'} tooltip={{ children: "New Card" }}>
                <Link href="/admin/cards/new"><PlusCircle /><span>New Card</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: "Play Game" }}>
                <Link href="/"><BookCopy /><span>Play Game</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col items-stretch gap-0">
          <form action={handleLogout} className="group-data-[collapsible=icon]:w-full">
            <Button variant="ghost" className="w-full justify-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:p-0">
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          </form>
          <div className="border-t border-sidebar-border w-full mt-2 pt-2 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:pt-0">
            <SidebarToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
