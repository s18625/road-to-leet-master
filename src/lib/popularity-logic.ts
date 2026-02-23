import { prisma } from "./prisma";

export async function recalculatePopularity() {
  console.log("Recalculating popularity...");

  const tags = await prisma.tag.findMany();
  const now = new Date();

  for (const tag of tags) {
    const problems = await prisma.problem.findMany({
      where: {
        tags: {
          some: { id: tag.id }
        }
      }
    });

    for (const problem of problems) {
      // Simple scoring: acceptanceRate (0-1) + (some mock popularity based on leetcodeId)
      // In a real app, we'd use likes/dislikes here.
      const likes = problem.likes || 100;
      const dislikes = problem.dislikes || 10;
      const acceptance = problem.acceptanceRate || 50;

      const score = (likes / (likes + dislikes)) * (acceptance / 100) * 100;

      await prisma.categoryPopular.upsert({
        where: {
          category_problemId: {
            category: tag.name,
            problemId: problem.id
          }
        },
        update: {
          score: score,
          generatedAt: now
        },
        create: {
          category: tag.name,
          problemId: problem.id,
          score: score,
          generatedAt: now
        }
      });
    }
  }

  console.log("Popularity recalculation finished.");
}
