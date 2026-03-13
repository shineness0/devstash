'use client';

import { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
