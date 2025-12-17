'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LogOut,
  PanelLeft,
  BookCopy,
  LayoutDashboard,
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

function ProfileSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-2">
                <Link href="/" className="text-xl font-bold text-primary pl-2 group-data-[collapsible=icon]:hidden">
                 CardWise
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/profile'} tooltip="Overview">
                        <Link href="/profile"><LayoutDashboard /><span>Overview</span></Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/profile/questions')} tooltip="My Questions">
                        <Link href="/profile/questions"><BookCopy /><span>My Questions</span></Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex-col items-stretch gap-2 border-t p-2">
            <SidebarMenuButton asChild tooltip="Logout">
                <Link href="/login"><LogOut /><span>Logout</span></Link>
            </SidebarMenuButton>
            <div className={cn("flex items-center", state === 'collapsed' ? 'justify-center' : 'justify-end')}>
                <SidebarToggle />
            </div>
            </SidebarFooter>
      </Sidebar>
    );
}


export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <ProfileSidebar />
        <SidebarInset>
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
