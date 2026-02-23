import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { fetchLeetCodeProblems } from '../src/lib/leetcode-provider';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting sync...');
  const problems = await fetchLeetCodeProblems(100); // Fetch first 100 for now
  console.log(`Fetched ${problems.length} problems`);

  for (const p of problems) {
    console.log(`Syncing: ${p.title}`);

    // Upsert Tag
    const tagIds = [];
    for (const tag of p.topicTags) {
      const dbTag = await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: { name: tag.name },
      });
      tagIds.push({ id: dbTag.id });
    }

    await prisma.problem.upsert({
      where: { slug: p.titleSlug },
      update: {
        title: p.title,
        difficulty: p.difficulty,
        acceptanceRate: p.acRate,
        paidOnly: p.isPaidOnly,
        likes: p.likes || 0,
        dislikes: p.dislikes || 0,
        url: `https://leetcode.com/problems/${p.titleSlug}/`,
        tags: {
          set: tagIds,
        },
      },
      create: {
        leetcodeId: p.frontendQuestionId,
        slug: p.titleSlug,
        title: p.title,
        difficulty: p.difficulty,
        acceptanceRate: p.acRate,
        paidOnly: p.isPaidOnly,
        likes: p.likes || 0,
        dislikes: p.dislikes || 0,
        url: `https://leetcode.com/problems/${p.titleSlug}/`,
        tags: {
          connect: tagIds,
        },
      },
    });
  }

  console.log('Sync finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
