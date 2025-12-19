'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LogOut,
  PanelLeft,
  BookCopy,
  LayoutDashboard,
  Settings,
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { LogoutConfirmationModal } from '@/components/common/LogoutConfirmationModal';
import { logout } from '@/lib/actions/authActions';
import ThemeToggle from '@/components/common/ThemeToggle';

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
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <>
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
                        <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/profile/settings')} tooltip="Settings">
                            <Link href="/profile/settings"><Settings /><span>Settings</span></Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="flex-col items-stretch gap-2 border-t p-2">
                    <SidebarMenuButton onClick={() => setIsLogoutModalOpen(true)} tooltip="Logout">
                        <LogOut /><span>Logout</span>
                    </SidebarMenuButton>
                    <div className={cn("flex items-center", state === 'collapsed' ? 'justify-center flex-col gap-2' : 'justify-between')}>
                        {state === 'expanded' && <ThemeToggle />}
                        <SidebarToggle />
                    </div>
                </SidebarFooter>
          </Sidebar>
          <LogoutConfirmationModal
            isOpen={isLogoutModalOpen}
            onOpenChange={setIsLogoutModalOpen}
            onConfirm={logout}
          />
        </>
    );
}

function MobileHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger className="h-8 w-8 text-muted-foreground" />
            <Link href="/profile" className="text-xl font-bold text-primary">CardWise</Link>
        </header>
    );
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <ProfileSidebar />
        <SidebarInset>
            <MobileHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}