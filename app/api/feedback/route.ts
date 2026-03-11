import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, addFeedback } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId, testId, textFeedback, fields } = await req.json();
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

  const test = user.tests.find(t => t.testId === testId);
  if (test) {
    test.feedbackSubmitted = true;
    updateUser(user);
  }

  const criteria = test?.criteria || '';
  const year = test?.year || '';

  addFeedback({
    id: `fb_${uuidv4().split('-')[0]}`,
    userId,
    testId,
    criteria,
    year,
    textFeedback,
    fields: fields || {},
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
