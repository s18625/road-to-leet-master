import { prisma } from "./prisma";
import { startOfDay } from "date-fns";

export async function getDailyChallenge(date: Date = new Date()) {
  const dayStart = startOfDay(date);

  // Check if we already have a challenge for this date
  let daily = await prisma.dailyChallenge.findUnique({
    where: { date: dayStart },
    include: { problem: { include: { tags: true } } },
  });

  if (!daily) {
    // Generate new daily challenge deterministically
    const allProblems = await prisma.problem.findMany({
      where: { paidOnly: false }, // Prefer non-paid
      orderBy: { leetcodeId: 'asc' },
    });

    if (allProblems.length === 0) return null;

    // Simple deterministic selection based on date
    // Use date string to create a seed-like value
    const dateStr = dayStart.toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    // Try to find a problem that hasn't been used in the last 60 days
    const recentChallenges = await prisma.dailyChallenge.findMany({
      where: {
        date: {
          gte: new Date(dayStart.getTime() - 60 * 24 * 60 * 60 * 1000),
        },
      },
      select: { problemId: true },
    });

    const usedProblemIds = new Set(recentChallenges.map(rc => rc.problemId));
    const availableProblems = allProblems.filter(p => !usedProblemIds.has(p.id));

    const pool = availableProblems.length > 0 ? availableProblems : allProblems;
    const index = Math.abs(hash) % pool.length;
    const selectedProblem = pool[index];

    daily = await prisma.dailyChallenge.create({
      data: {
        date: dayStart,
        problemId: selectedProblem.id,
      },
      include: { problem: { include: { tags: true } } },
    });
  }

  return daily;
}
