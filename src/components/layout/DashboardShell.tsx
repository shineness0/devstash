'use client';

import { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import type { SidebarData } from '@/lib/db/sidebar';

export function DashboardShell({ children, sidebarData }: { children: React.ReactNode; sidebarData: SidebarData }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar onMenuClick={() => setIsMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          data={sidebarData}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
