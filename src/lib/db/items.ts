import { prisma } from '@/lib/prisma';

export type ItemWithType = Awaited<ReturnType<typeof getPinnedItems>>[number];

export async function getPinnedItems() {
  return prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
    },
  });
}

export async function getRecentItems(limit = 10) {
  return prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
    },
  });
}
