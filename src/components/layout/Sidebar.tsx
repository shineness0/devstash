'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  Pin,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  X,
  Folder,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import { UserAvatar } from '@/components/shared/UserAvatar';
import type { SidebarData } from '@/lib/db/sidebar';
import type { Session } from 'next-auth';

type SessionUser = Session['user'];

interface SidebarContentProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  data: SidebarData;
  user: SessionUser | null;
}

function SidebarContent({ isCollapsed, onToggleCollapse, data, user }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemTypes, favoriteCollections, recentCollections, totalItems, favoriteItemCount, pinnedItemCount } = data;

  const navItem = (href: string) =>
    cn(
      'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      pathname === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
      isCollapsed && 'justify-center px-2'
    );

  return (
    <div className="flex flex-col h-full">
      {/* Collapse toggle */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-border px-3 shrink-0',
          isCollapsed ? 'justify-center' : 'justify-end'
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-5">
        {/* Quick Access */}
        {!isCollapsed && (
          <section>
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Access
            </p>
            <nav className="space-y-0.5">
              <Link href="/dashboard" className={navItem('/dashboard')}>
                <LayoutGrid className="h-4 w-4 shrink-0" />
                <span className="flex-1">All Items</span>
                <span className="text-xs tabular-nums">{totalItems}</span>
              </Link>
              <Link href="/dashboard/favorites" className={navItem('/dashboard/favorites')}>
                <Star className="h-4 w-4 shrink-0" />
                <span className="flex-1">Favorites</span>
                <span className="text-xs tabular-nums">{favoriteItemCount}</span>
              </Link>
              <Link href="/dashboard/recent" className={navItem('/dashboard/recent')}>
                <Clock className="h-4 w-4 shrink-0" />
                <span className="flex-1">Recently Used</span>
              </Link>
              <Link href="/dashboard/pinned" className={navItem('/dashboard/pinned')}>
                <Pin className="h-4 w-4 shrink-0" />
                <span className="flex-1">Pinned</span>
                <span className="text-xs tabular-nums">{pinnedItemCount}</span>
              </Link>
            </nav>
          </section>
        )}

        {/* Types */}
        <section>
          {!isCollapsed && (
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Types
            </p>
          )}
          <nav className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = TYPE_ICON_MAP[type.name];
              const count = type._count.items;
              const href = `/items/${type.name}s`;
              return (
                <Link
                  key={type.id}
                  href={href}
                  className={navItem(href)}
                  title={isCollapsed ? type.name : undefined}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      {(type.name === 'file' || type.name === 'image') && (
                        <Badge variant="outline" className="h-4 px-1 text-[9px] font-semibold text-muted-foreground border-muted-foreground/30">
                          PRO
                        </Badge>
                      )}
                      {count > 0 && <span className="text-xs tabular-nums">{count}</span>}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </section>

        {/* Favorite Collections */}
        {!isCollapsed && favoriteCollections.length > 0 && (
          <section>
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Favorites
            </p>
            <nav className="space-y-0.5">
              {favoriteCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className={navItem(`/collections/${col.id}`)}
                >
                  <Star className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span className="flex-1 truncate">{col.name}</span>
                </Link>
              ))}
            </nav>
          </section>
        )}

        {/* Recent Collections */}
        {!isCollapsed && (
          <section>
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent
            </p>
            <nav className="space-y-0.5">
              {recentCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className={navItem(`/collections/${col.id}`)}
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: col.dominantColor }}
                  />
                  <span className="flex-1 truncate">{col.name}</span>
                </Link>
              ))}
              <Link
                href="/collections"
                className="flex items-center gap-3 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all collections
              </Link>
            </nav>
          </section>
        )}
      </div>

      {/* User avatar */}
      <div className="border-t border-border p-3 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'flex items-center gap-3 w-full rounded-md p-1 hover:bg-accent transition-colors text-left',
              isCollapsed && 'justify-center'
            )}
          >
            <UserAvatar name={user?.name} image={user?.image} />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">
                  {user?.name ?? 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {user?.email ?? ''}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={isCollapsed ? 'center' : 'start'} className="w-52">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  data: SidebarData;
  user: SessionUser | null;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose, data, user }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border bg-background shrink-0',
          'transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-14' : 'w-60'
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} data={data} user={user} />
      </aside>

      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onMobileClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-background',
          'lg:hidden transition-transform duration-200 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onMobileClose}
          className="absolute right-2 top-[15px] p-1.5 rounded-md hover:bg-accent text-muted-foreground z-10"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent isCollapsed={false} onToggleCollapse={() => {}} data={data} user={user} />
      </aside>
    </>
  );
}
