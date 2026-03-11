import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// State is managed client-side via localStorage.
// This route only validates the user and returns a new testId.
export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

  const testId = `test_${uuidv4().split('-')[0]}`;
  return NextResponse.json({ success: true, testId });
}
