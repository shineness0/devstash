import { prisma } from '@/lib/prisma';

export type CollectionWithTypes = Awaited<ReturnType<typeof getRecentCollections>>[number];

export async function getRecentCollections(limit = 4) {
  return prisma.collection.findMany({
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      defaultType: true,
      items: {
        include: {
          item: {
            include: {
              itemType: {
                select: { id: true, name: true, icon: true, color: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getDashboardStats() {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count(),
    prisma.collection.count(),
    prisma.item.count({ where: { isFavorite: true } }),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);
  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
