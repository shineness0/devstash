import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // Test connection + fetch system item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log(`✓ Connected to database`);
  console.log(`✓ Found ${itemTypes.length} system item types:\n`);

  for (const type of itemTypes) {
    console.log(`  ${type.color}  ${type.name} (icon: ${type.icon})`);
  }

  // Test counts
  const [userCount, collectionCount, itemCount] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
  ]);

  console.log(`\n✓ Table counts:`);
  console.log(`  users:       ${userCount}`);
  console.log(`  collections: ${collectionCount}`);
  console.log(`  items:       ${itemCount}`);
}

main()
  .catch((e) => {
    console.error("✗ Database connection failed:\n", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
