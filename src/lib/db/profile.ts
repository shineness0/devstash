import { prisma } from '@/lib/prisma';

export type ProfileData = Awaited<ReturnType<typeof getProfileData>>;

export async function getProfileData(userId: string) {
  const [user, itemTypeCounts, totalCollections, githubAccount] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        password: true,
      },
    }),
    prisma.item.groupBy({
      by: ['itemTypeId'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.collection.count({ where: { userId } }),
    prisma.account.findFirst({
      where: { userId, provider: 'github' },
      select: { id: true },
    }),
  ]);

  const itemTypeIds = itemTypeCounts.map((r) => r.itemTypeId);
  const itemTypes = await prisma.itemType.findMany({
    where: { id: { in: itemTypeIds } },
    select: { id: true, name: true, color: true, icon: true },
  });

  const typeMap = Object.fromEntries(itemTypes.map((t) => [t.id, t]));

  const itemTypeBreakdown = itemTypeCounts.map((r) => ({
    type: typeMap[r.itemTypeId],
    count: r._count._all,
  }));

  const totalItems = itemTypeCounts.reduce((sum, r) => sum + r._count._all, 0);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    },
    isGitHubUser: !!githubAccount,
    hasPassword: !!user.password,
    totalItems,
    totalCollections,
    itemTypeBreakdown,
  };
}
