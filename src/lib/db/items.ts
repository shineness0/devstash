import { prisma } from '@/lib/prisma';

export type ItemWithType = Awaited<ReturnType<typeof getPinnedItems>>[number];

export async function getPinnedItems(userId?: string) {
  return prisma.item.findMany({
    where: { isPinned: true, ...(userId ? { userId } : {}) },
    orderBy: { updatedAt: 'desc' },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
    },
  });
}

export async function getRecentItems(limit = 10, userId?: string) {
  return prisma.item.findMany({
    where: userId ? { userId } : {},
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
    },
  });
}

export async function getItemById(id: string, userId: string) {
  return prisma.item.findFirst({
    where: { id, userId },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
      collections: {
        include: {
          collection: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export type ItemDetail = NonNullable<Awaited<ReturnType<typeof getItemById>>>;

export async function updateItem(
  id: string,
  userId: string,
  data: {
    title: string;
    description: string | null;
    content: string | null;
    url: string | null;
    language: string | null;
    tags: string[];
  }
) {
  return prisma.item.update({
    where: { id, userId },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        set: [],
        connectOrCreate: data.tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
      collections: {
        include: {
          collection: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function deleteItem(id: string, userId: string) {
  return prisma.item.delete({
    where: { id, userId },
  });
}

export async function getItemsByType(userId: string, typeName: string) {
  return prisma.item.findMany({
    where: {
      userId,
      itemType: { name: typeName },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { id: true, name: true } },
    },
  });
}
