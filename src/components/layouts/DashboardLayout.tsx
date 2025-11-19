'use client';

import { AppSidebar } from '../AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

import { ThemeToggle } from '../ThemeToggle';

interface DashboardLayoutProps {
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({ action, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 z-10 bg-sidebar">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="text-lg font-semibold">Manajemen Kontak</div>
          </div>
          <div className="flex items-center gap-2">
            {action ? action : null}
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 bg-muted/30">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
