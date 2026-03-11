import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId, criteria, year } = await req.json();
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

  if (user.usedCredits >= user.totalCredits) {
    return NextResponse.json({ success: false, error: 'Sem créditos disponíveis' }, { status: 400 });
  }

  const testId = `test_${uuidv4().split('-')[0]}`;
  user.usedCredits += 1;
  user.tests.push({
    testId,
    criteria,
    year,
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    feedbackSubmitted: false,
  });
  updateUser(user);

  return NextResponse.json({ success: true, testId });
}
