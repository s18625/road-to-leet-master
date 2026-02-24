import { NextResponse } from "next/server";
import { getDailyChallenge } from "@/lib/daily-logic";

export async function GET() {
  try {
    const daily = await getDailyChallenge();
    if (!daily) {
      return NextResponse.json({ error: "No problems available" }, { status: 404 });
    }
    return NextResponse.json(daily);
  } catch (error) {
    console.error("Daily challenge error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
