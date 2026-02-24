import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchLeetCodeProblems } from '@/lib/leetcode-provider';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('Starting sync from cron...');
    const problems = await fetchLeetCodeProblems(100);

    for (const p of problems) {
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

    return NextResponse.json({ success: true, synced: problems.length });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
