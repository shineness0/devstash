import Link from 'next/link';
import { Folder, Star } from 'lucide-react';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import type { CollectionWithTypes } from '@/lib/db/collections';

function getDominantTypeColor(collection: CollectionWithTypes): string {
  if (collection.items.length === 0) {
    return collection.defaultType?.color ?? '#6b7280';
  }

  const typeCounts: Record<string, { count: number; color: string }> = {};
  for (const { item } of collection.items) {
    const { id, color } = item.itemType;
    if (!typeCounts[id]) typeCounts[id] = { count: 0, color };
    typeCounts[id].count++;
  }

  const dominant = Object.values(typeCounts).sort((a, b) => b.count - a.count)[0];
  return dominant?.color ?? '#6b7280';
}

function getUniqueTypes(collection: CollectionWithTypes) {
  const seen = new Set<string>();
  const types: { id: string; name: string; color: string }[] = [];
  for (const { item } of collection.items) {
    if (!seen.has(item.itemType.id)) {
      seen.add(item.itemType.id);
      types.push(item.itemType);
    }
  }
  return types;
}

export function CollectionCard({ collection }: { collection: CollectionWithTypes }) {
  const itemCount = collection.items.length;
  const accentColor = getDominantTypeColor(collection);
  const uniqueTypes = getUniqueTypes(collection);

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 hover:border-border/60 transition-colors"
      style={{ borderTopColor: accentColor, borderTopWidth: '2px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Folder className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        {collection.isFavorite && (
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mt-0.5" />
        )}
      </div>

      <h3 className="text-sm font-semibold leading-snug line-clamp-1 mb-1">{collection.name}</h3>

      {collection.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{collection.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
        {uniqueTypes.length > 0 && (
          <div className="flex items-center gap-1">
            {uniqueTypes.slice(0, 5).map((type) => {
              const Icon = TYPE_ICON_MAP[type.name];
              if (!Icon) return null;
              return <Icon key={type.id} className="h-3 w-3" style={{ color: type.color }} />;
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
