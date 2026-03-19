'use client';

import { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { NewItemModal } from '@/components/items/NewItemModal';
import type { SidebarData } from '@/lib/db/sidebar';
import type { Session } from 'next-auth';

type SessionUser = Session['user'];

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData;
  user: SessionUser | null;
}

export function DashboardShell({ children, sidebarData, user }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [newItemOpen, setNewItemOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar
        onMenuClick={() => setIsMobileOpen(true)}
        onNewItem={() => setNewItemOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          data={sidebarData}
          user={user}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <NewItemModal
        open={newItemOpen}
        onOpenChange={setNewItemOpen}
        itemTypes={sidebarData.itemTypes}
      />
    </div>
  );
}
