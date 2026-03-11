import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getCriteria } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  if (url.searchParams.get('criteria')) {
    return NextResponse.json({ criteria: getCriteria() });
  }

  const userId = url.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

  return NextResponse.json({
    ...user,
    remainingCredits: user.totalCredits - user.usedCredits,
  });
}
