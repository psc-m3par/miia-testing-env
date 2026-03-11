import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { testId, userId } = await req.json();
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

  const test = user.tests.find(t => t.testId === testId);
  if (!test) return NextResponse.json({ success: false, error: 'Teste não encontrado' }, { status: 404 });

  test.status = 'completed';
  test.completedAt = new Date().toISOString();
  updateUser(user);

  return NextResponse.json({ success: true });
}
