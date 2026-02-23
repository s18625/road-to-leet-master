import 'dotenv/config';
import { recalculatePopularity } from '../src/lib/popularity-logic';
import { prisma } from '../src/lib/prisma';

async function main() {
  await recalculatePopularity();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
