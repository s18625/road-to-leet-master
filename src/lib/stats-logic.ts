import { prisma } from "./prisma";
import { startOfDay, subDays, isSameDay } from "date-fns";

export async function getUserStats(userId: string) {
  const progress = await prisma.userProgress.findMany({
    where: { userId },
    include: {
      problem: {
        include: {
          tags: true
        }
      }
    }
  });

  const solved = progress.filter(p => p.status === 'solved');
  const attempted = progress.filter(p => p.status === 'attempted');

  // Difficulty distribution
  const difficultyDist = {
    Easy: solved.filter(p => p.problem.difficulty === 'Easy').length,
    Medium: solved.filter(p => p.problem.difficulty === 'Medium').length,
    Hard: solved.filter(p => p.problem.difficulty === 'Hard').length,
  };

  // Category stats
  const categoryStats: Record<string, number> = {};
  solved.forEach(p => {
    p.problem.tags.forEach(tag => {
      categoryStats[tag.name] = (categoryStats[tag.name] || 0) + 1;
    });
  });

  // Streak calculation
  // Get all unique days where user solved something
  const solvedDates = solved
    .map(p => p.solvedAt)
    .filter((d): d is Date => d !== null)
    .map(d => startOfDay(d).getTime())
    .sort((a, b) => b - a); // Descending

  const uniqueSolvedDates = Array.from(new Set(solvedDates));

  let streak = 0;
  let currentDay = startOfDay(new Date());

  for (let i = 0; i < uniqueSolvedDates.length; i++) {
    const solvedDay = new Date(uniqueSolvedDates[i]);
    if (isSameDay(solvedDay, currentDay)) {
      streak++;
      currentDay = subDays(currentDay, 1);
    } else if (isSameDay(solvedDay, subDays(currentDay, 1))) {
       // This shouldn't happen with the current logic but just in case
       streak++;
       currentDay = subDays(solvedDay, 1);
    } else {
      // Check if we missed a day
      if (i === 0 && isSameDay(solvedDay, subDays(startOfDay(new Date()), 1))) {
          // If haven't solved today, but solved yesterday, streak continues from yesterday
          streak++;
          currentDay = subDays(solvedDay, 1);
          continue;
      }
      break;
    }
  }

  return {
    overview: {
      solved: solved.length,
      attempted: attempted.length,
      total: await prisma.problem.count(),
    },
    difficultyDist,
    categoryStats,
    streak,
  };
}
