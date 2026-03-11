import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// State is managed client-side via localStorage.
// This route is a no-op kept for API compatibility.
export async function POST() {
  return NextResponse.json({ success: true });
}
