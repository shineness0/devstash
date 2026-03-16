import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const KEEP_EMAIL = "demo@devstash.io";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const targets = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: { id: true, email: true },
  });

  if (targets.length === 0) {
    console.log("No users to delete.");
    return;
  }

  console.log(`Deleting ${targets.length} user(s):`);
  for (const u of targets) {
    console.log(`  ${u.email}`);
  }

  const { count } = await prisma.user.deleteMany({
    where: { email: { not: KEEP_EMAIL } },
  });

  console.log(`\n✓ Deleted ${count} user(s). Kept: ${KEEP_EMAIL}`);
}

main()
  .catch((e) => {
    console.error("✗ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
