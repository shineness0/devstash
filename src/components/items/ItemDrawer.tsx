'use client';

import { Star, Pin, Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDrawerProps {
  itemId: string | null;
  item: ItemDetail | null;
  loading: boolean;
  onClose: () => void;
}

export function ItemDrawer({ itemId, item, loading, onClose }: ItemDrawerProps) {
  const open = itemId !== null;

  async function handleCopyContent() {
    if (!item) return;
    const text = item.content ?? item.url ?? '';
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-y-auto">
        {loading || !item ? (
          <DrawerSkeleton />
        ) : (
          <DrawerContent item={item} onCopyContent={handleCopyContent} />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full mt-2" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

interface DrawerContentProps {
  item: ItemDetail;
  onCopyContent: () => void;
}

function DrawerContent({ item, onCopyContent }: DrawerContentProps) {
  const Icon = TYPE_ICON_MAP[item.itemType.name] ?? null;
  const isCode = item.itemType.name === 'snippet' || item.itemType.name === 'command';
  const collections = item.collections.map((ic) => ic.collection);
  const createdAt = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const updatedAt = new Date(item.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {/* Header */}
      <SheetHeader className="flex-row items-start justify-between gap-2 px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-start gap-2 min-w-0">
          {Icon && (
            <Icon
              className="h-4 w-4 mt-0.5 shrink-0"
              style={{ color: item.itemType.color }}
            />
          )}
          <SheetTitle className="text-sm font-semibold leading-snug text-left">
            {item.title}
          </SheetTitle>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-1 shrink-0">
          <ActionButton
            icon={<Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />}
            tooltip="Favorite"
            disabled
          />
          <ActionButton
            icon={<Pin className={`h-4 w-4 ${item.isPinned ? 'rotate-45 text-foreground' : ''}`} />}
            tooltip="Pin"
            disabled
          />
          <ActionButton icon={<Copy className="h-4 w-4" />} tooltip="Copy" onClick={onCopyContent} />
          <ActionButton icon={<Pencil className="h-4 w-4" />} tooltip="Edit" disabled />
          <ActionButton
            icon={<Trash2 className="h-4 w-4 text-destructive" />}
            tooltip="Delete"
            disabled
          />
        </div>
      </SheetHeader>

      {/* Body */}
      <div className="flex flex-col gap-5 px-6 py-5">
        {/* Description */}
        {item.description && (
          <section>
            <SectionLabel>Description</SectionLabel>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </section>
        )}

        {/* Content */}
        {item.content && (
          <section>
            <div className="flex items-center justify-between mb-1.5">
              <SectionLabel>Content</SectionLabel>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" onClick={onCopyContent}>
                <Copy className="h-3 w-3" /> Copy
              </Button>
            </div>
            <pre
              className={`text-xs leading-relaxed whitespace-pre-wrap wrap-break-word rounded-md p-3 bg-muted/50 border border-border ${
                isCode ? 'font-mono' : ''
              }`}
            >
              {item.content}
            </pre>
          </section>
        )}

        {/* URL */}
        {item.url && isSafeUrl(item.url) && (
          <section>
            <SectionLabel>URL</SectionLabel>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline break-all"
            >
              {item.url}
            </a>
          </section>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <section>
            <SectionLabel>Collections</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {collections.map((col) => (
                <span
                  key={col.id}
                  className="inline-flex items-center rounded-md px-2 py-0.5 text-xs bg-muted text-muted-foreground"
                >
                  {col.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <section>
            <SectionLabel>Tags</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Dates */}
        <section className="mt-auto pt-2 border-t border-border grid grid-cols-2 gap-3">
          <div>
            <SectionLabel>Created</SectionLabel>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
          <div>
            <SectionLabel>Last Updated</SectionLabel>
            <p className="text-xs text-muted-foreground">{updatedAt}</p>
          </div>
        </section>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
      {children}
    </p>
  );
}

function ActionButton({
  icon,
  tooltip,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={disabled ? `${tooltip} (coming soon)` : tooltip}
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
    >
      {icon}
    </button>
  );
}
