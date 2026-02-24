import { NextRequest, NextResponse } from 'next/server';
import { recalculatePopularity } from '@/lib/popularity-logic';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('Recalculating popularity from cron...');
    await recalculatePopularity();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Recalculation failed:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
