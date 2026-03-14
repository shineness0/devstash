import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // ── System item types ──────────────────────────────────────────────────────
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log(`✓ Connected to database`);
  console.log(`✓ Found ${itemTypes.length} system item types:\n`);
  for (const type of itemTypes) {
    console.log(`  ${type.color}  ${type.name} (icon: ${type.icon})`);
  }

  // ── Table counts ───────────────────────────────────────────────────────────
  const [userCount, collectionCount, itemCount, tagCount] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);

  console.log(`\n✓ Table counts:`);
  console.log(`  users:       ${userCount}`);
  console.log(`  collections: ${collectionCount}`);
  console.log(`  items:       ${itemCount}`);
  console.log(`  tags:        ${tagCount}`);

  // ── Demo user ──────────────────────────────────────────────────────────────
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });

  if (!demoUser) {
    console.log(`\n✗ Demo user not found — run npm run db:seed`);
    return;
  }

  console.log(`\n✓ Demo user:`);
  console.log(`  name:          ${demoUser.name}`);
  console.log(`  email:         ${demoUser.email}`);
  console.log(`  isPro:         ${demoUser.isPro}`);
  console.log(`  emailVerified: ${demoUser.emailVerified?.toISOString() ?? "null"}`);
  console.log(`  password set:  ${!!demoUser.password}`);

  // ── Collections ────────────────────────────────────────────────────────────
  const collections = await prisma.collection.findMany({
    where: { userId: demoUser.id },
    include: {
      defaultType: true,
      items: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n✓ Collections (${collections.length}):\n`);
  for (const col of collections) {
    console.log(`  [${col.name}]  ${col.items.length} item(s)  — default type: ${col.defaultType?.name ?? "none"}`);
    console.log(`    ${col.description}`);
  }

  // ── Items by type ──────────────────────────────────────────────────────────
  const items = await prisma.item.findMany({
    where: { userId: demoUser.id },
    include: {
      itemType: true,
      tags: true,
      collections: { include: { collection: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n✓ Items (${items.length}):\n`);
  for (const item of items) {
    const colNames = item.collections.map((ic) => ic.collection.name).join(", ");
    const tagNames = item.tags.map((t) => t.name).join(", ");
    console.log(`  [${item.itemType.name}] ${item.title}`);
    console.log(`    collections: ${colNames || "none"}`);
    if (tagNames) console.log(`    tags:        ${tagNames}`);
    if (item.url)  console.log(`    url:         ${item.url}`);
  }
}

main()
  .catch((e) => {
    console.error("✗ Database connection failed:\n", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
