import { mockItems, mockCollections, mockItemTypes } from '@/lib/mock-data';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { CollectionCard } from '@/components/dashboard/CollectionCard';

const stats = {
  totalItems: mockItems.length,
  totalCollections: mockCollections.length,
  favoriteItems: mockItems.filter((i) => i.isFavorite).length,
  favoriteCollections: mockCollections.filter((c) => c.isFavorite).length,
};

const recentCollections = [...mockCollections]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  .slice(0, 4);

const pinnedItems = mockItems.filter((i) => i.isPinned);

const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <StatsCards stats={stats} />

      {/* Recent Collections */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Recent Collections
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recentCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              itemTypes={mockItemTypes}
              items={mockItems}
            />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Pinned Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} itemTypes={mockItemTypes} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Recent Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} itemTypes={mockItemTypes} />
          ))}
        </div>
      </section>
    </div>
  );
}
