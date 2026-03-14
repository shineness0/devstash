import { prisma } from '@/lib/prisma';

export type SidebarData = Awaited<ReturnType<typeof getSidebarData>>;

export async function getSidebarData() {
  const [itemTypes, favoriteCollections, recentCollections, totalItems, favoriteItemCount, pinnedItemCount] =
    await Promise.all([
      prisma.itemType.findMany({
        where: { isSystem: true },
        include: { _count: { select: { items: true } } },
      }),
      prisma.collection.findMany({
        where: { isFavorite: true },
        select: { id: true, name: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.collection.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          name: true,
          items: {
            select: {
              item: {
                select: { itemType: { select: { color: true } } },
              },
            },
          },
        },
      }),
      prisma.item.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.item.count({ where: { isPinned: true } }),
    ]);

  const recentCollectionsWithColor = recentCollections.map((col) => {
    const colorCounts: Record<string, number> = {};
    for (const { item } of col.items) {
      colorCounts[item.itemType.color] = (colorCounts[item.itemType.color] || 0) + 1;
    }
    const dominantColor =
      Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '#6b7280';
    return { id: col.id, name: col.name, dominantColor };
  });

  return {
    itemTypes,
    favoriteCollections,
    recentCollections: recentCollectionsWithColor,
    totalItems,
    favoriteItemCount,
    pinnedItemCount,
  };
}
