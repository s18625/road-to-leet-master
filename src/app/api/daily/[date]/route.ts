import { NextRequest, NextResponse } from "next/server";
import { getDailyChallenge } from "@/lib/daily-logic";
import { parseISO, isValid } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
  }

  try {
    const daily = await getDailyChallenge(parsedDate);
    if (!daily) {
      return NextResponse.json({ error: "No problems available" }, { status: 404 });
    }
    return NextResponse.json(daily);
  } catch (error) {
    console.error("Daily challenge error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
