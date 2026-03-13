import { LayoutGrid, Folder, Star, Bookmark } from 'lucide-react';

interface Stats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Items', value: stats.totalItems, icon: LayoutGrid, color: '#3b82f6' },
    { label: 'Collections', value: stats.totalCollections, icon: Folder, color: '#10b981' },
    { label: 'Favorite Items', value: stats.favoriteItems, icon: Star, color: '#f59e0b' },
    { label: 'Favorite Collections', value: stats.favoriteCollections, icon: Bookmark, color: '#8b5cf6' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
