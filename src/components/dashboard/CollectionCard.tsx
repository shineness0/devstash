import Link from 'next/link';
import { Folder, Star } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  defaultTypeId: string | null;
}

interface ItemType {
  id: string;
  name: string;
  color: string;
}

interface Item {
  id: string;
  collectionIds: string[];
}

export function CollectionCard({
  collection,
  itemTypes,
  items,
}: {
  collection: Collection;
  itemTypes: ItemType[];
  items: Item[];
}) {
  const itemCount = items.filter((item) => item.collectionIds.includes(collection.id)).length;
  const defaultType = itemTypes.find((t) => t.id === collection.defaultTypeId);
  const accentColor = defaultType?.color ?? '#6b7280';

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 hover:border-border/60 transition-colors"
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

      <p className="text-xs text-muted-foreground mt-2">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
    </Link>
  );
}
