import { getRecentCollections, getDashboardStats } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems } from '@/lib/db/items';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CollectionCard } from '@/components/dashboard/CollectionCard';
import { ItemsClientWrapper } from '@/components/items/ItemsClientWrapper';

export default async function DashboardPage() {
  const [recentCollections, stats, pinnedItems, recentItems] = await Promise.all([
    getRecentCollections(4),
    getDashboardStats(),
    getPinnedItems(),
    getRecentItems(10),
  ]);

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
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Pinned Items
          </h2>
          <ItemsClientWrapper
            items={pinnedItems}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          />
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Recent Items
        </h2>
        <ItemsClientWrapper
          items={recentItems}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        />
      </section>
    </div>
  );
}
