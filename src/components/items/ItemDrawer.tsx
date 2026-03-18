'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Pin, Copy, Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import { updateItem } from '@/actions/items';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDrawerProps {
  itemId: string | null;
  item: ItemDetail | null;
  loading: boolean;
  onClose: () => void;
  onItemUpdate: (item: ItemDetail) => void;
}

export function ItemDrawer({ itemId, item, loading, onClose, onItemUpdate }: ItemDrawerProps) {
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
          <DrawerContent
            item={item}
            onCopyContent={handleCopyContent}
            onItemUpdate={onItemUpdate}
          />
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

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);

interface DrawerContentProps {
  item: ItemDetail;
  onCopyContent: () => void;
  onItemUpdate: (item: ItemDetail) => void;
}

function DrawerContent({ item, onCopyContent, onItemUpdate }: DrawerContentProps) {
  const router = useRouter();
  const Icon = TYPE_ICON_MAP[item.itemType.name] ?? null;
  const isCode = item.itemType.name === 'snippet' || item.itemType.name === 'command';
  const collections = item.collections.map((ic) => ic.collection);
  const showContent = CONTENT_TYPES.has(item.itemType.name);
  const showLanguage = LANGUAGE_TYPES.has(item.itemType.name);
  const showUrl = item.itemType.name === 'link';

  const createdAt = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const updatedAt = new Date(item.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? '');
  const [content, setContent] = useState(item.content ?? '');
  const [url, setUrl] = useState(item.url ?? '');
  const [language, setLanguage] = useState(item.language ?? '');
  const [tags, setTags] = useState(item.tags.map((t) => t.name).join(', '));

  function handleStartEdit() {
    setTitle(item.title);
    setDescription(item.description ?? '');
    setContent(item.content ?? '');
    setUrl(item.url ?? '');
    setLanguage(item.language ?? '');
    setTags(item.tags.map((t) => t.name).join(', '));
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(item.id, {
      title,
      description: description || null,
      content: showContent ? (content || null) : null,
      url: showUrl ? (url || null) : null,
      language: showLanguage ? (language || null) : null,
      tags: tagArray,
    });

    setSaving(false);

    if (result.success) {
      toast.success('Item saved');
      onItemUpdate(result.data);
      setIsEditing(false);
      router.refresh();
    } else {
      const err = typeof result.error === 'string' ? result.error : 'Validation failed';
      toast.error(err);
    }
  }

  return (
    <>
      {/* Header */}
      <SheetHeader className="flex-row items-start justify-between gap-2 px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {Icon && (
            <Icon
              className="h-4 w-4 mt-0.5 shrink-0"
              style={{ color: item.itemType.color }}
            />
          )}
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-7 text-sm font-semibold px-2 py-0"
              placeholder="Title"
              autoFocus
            />
          ) : (
            <SheetTitle className="text-sm font-semibold leading-snug text-left">
              {item.title}
            </SheetTitle>
          )}
        </div>

        {/* Action bar */}
        {isEditing ? (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs gap-1"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={handleSave}
              disabled={saving || !title.trim()}
            >
              <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        ) : (
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
            <ActionButton icon={<Pencil className="h-4 w-4" />} tooltip="Edit" onClick={handleStartEdit} />
            <ActionButton
              icon={<Trash2 className="h-4 w-4 text-destructive" />}
              tooltip="Delete"
              disabled
            />
          </div>
        )}
      </SheetHeader>

      {/* Body */}
      <div className="flex flex-col gap-5 px-6 py-5">
        {/* Description */}
        <section>
          {isEditing ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-description" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="text-sm resize-none min-h-15"
                rows={2}
              />
            </div>
          ) : item.description ? (
            <>
              <SectionLabel>Description</SectionLabel>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </>
          ) : null}
        </section>

        {/* Content */}
        {showContent && (
          <section>
            {isEditing ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-content" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content"
                  className={`text-xs resize-none min-h-30 ${isCode ? 'font-mono' : ''}`}
                  rows={6}
                />
              </div>
            ) : item.content ? (
              <>
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
              </>
            ) : null}
          </section>
        )}

        {/* Language */}
        {showLanguage && isEditing && (
          <section>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-language" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Language
              </Label>
              <Input
                id="edit-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. TypeScript"
                className="h-8 text-sm"
              />
            </div>
          </section>
        )}

        {/* URL */}
        {showUrl && (
          <section>
            {isEditing ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-url" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-sm"
                />
              </div>
            ) : item.url && isSafeUrl(item.url) ? (
              <>
                <SectionLabel>URL</SectionLabel>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline break-all"
                >
                  {item.url}
                </a>
              </>
            ) : null}
          </section>
        )}

        {/* Tags */}
        <section>
          {isEditing ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-tags" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </Label>
              <Input
                id="edit-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma, separated, tags"
                className="h-8 text-sm"
              />
            </div>
          ) : item.tags.length > 0 ? (
            <>
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
            </>
          ) : null}
        </section>

        {/* Collections (display only) */}
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
