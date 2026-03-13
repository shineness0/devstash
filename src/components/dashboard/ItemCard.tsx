import { Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon, Star, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  file: File,
  image: Image,
  link: LinkIcon,
};

interface Item {
  id: string;
  title: string;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null;
  url?: string | null;
  description: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  itemTypeId: string;
}

interface ItemType {
  id: string;
  name: string;
  color: string;
}

export function ItemCard({ item, itemTypes }: { item: Item; itemTypes: ItemType[] }) {
  const type = itemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = type ? TYPE_ICON_MAP[type.name] : null;
  const isCode = type?.name === 'snippet' || type?.name === 'command';

  const preview = item.content
    ? item.content.slice(0, 150).trim()
    : item.url || item.description || '';

  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card p-4 hover:border-border/60 transition-colors">
      {/* Top-right indicators */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        {item.isPinned && (
          <Pin className="h-3.5 w-3.5 text-muted-foreground rotate-45" />
        )}
        {item.isFavorite && (
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug pr-10 mb-2 line-clamp-1">
        {item.title}
      </h3>

      {/* Content preview */}
      {preview && (
        <div className="flex-1 mb-3">
          <p
            className={cn(
              'text-xs leading-relaxed line-clamp-3',
              isCode
                ? 'font-mono text-muted-foreground bg-muted/50 rounded p-2'
                : 'text-muted-foreground'
            )}
          >
            {preview}
          </p>
        </div>
      )}

      {/* Bottom row: tags + type icon */}
      <div className="flex items-end justify-between gap-2 mt-auto pt-1">
        <div className="flex flex-wrap gap-1 min-w-0">
          {item.language && (
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
              {item.language}
            </span>
          )}
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        {Icon && type && (
          <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
        )}
      </div>
    </div>
  );
}
