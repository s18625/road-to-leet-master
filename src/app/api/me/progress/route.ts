import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { problemId, status, timeSpent, notes } = await request.json();

  if (!problemId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {
        status,
        timeSpent: timeSpent !== undefined ? timeSpent : undefined,
        notes: notes !== undefined ? notes : undefined,
        lastAttemptAt: new Date(),
        solvedAt: status === "solved" ? new Date() : undefined,
        attemptsCount: { increment: 1 },
      },
      create: {
        userId,
        problemId,
        status,
        timeSpent,
        notes,
        attemptsCount: 1,
        solvedAt: status === "solved" ? new Date() : undefined,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
