import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// State is managed client-side via localStorage.
// Just returns a new unique testId — no server-side user validation needed.
export async function POST() {
  const testId = `test_${uuidv4().split('-')[0]}`;
  return NextResponse.json({ success: true, testId });
}
