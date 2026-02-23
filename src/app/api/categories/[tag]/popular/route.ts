import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const popular = await prisma.categoryPopular.findMany({
      where: { category: tag },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        problem: {
          include: {
            tags: true
          }
        }
      }
    });

    return NextResponse.json(popular);
  } catch (error) {
    console.error("Popular categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
