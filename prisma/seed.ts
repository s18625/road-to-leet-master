import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    },
  });

  // Most problems are already synced by our sync-problems script,
  // but let's ensure we have at least some known ones if sync wasn't run.
  // Actually, we should rely on the sync script for problems.

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
