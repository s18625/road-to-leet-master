import { prisma } from '../src/lib/prisma';
import { getUserStats } from '../src/lib/stats-logic';

async function test() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', name: 'Test User' }
  });
  console.log('User:', user.id);

  const problem = await prisma.problem.findFirst();
  if (problem) {
    await prisma.userProgress.upsert({
      where: { userId_problemId: { userId: user.id, problemId: problem.id } },
      update: { status: 'solved', solvedAt: new Date() },
      create: { userId: user.id, problemId: problem.id, status: 'solved', solvedAt: new Date() }
    });
  }

  const stats = await getUserStats(user.id);
  console.log('Stats:', JSON.stringify(stats, null, 2));
}

test().finally(() => prisma.$disconnect());
