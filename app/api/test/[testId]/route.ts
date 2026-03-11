import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { testId: string } }) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

  const test = user.tests.find(t => t.testId === params.testId);
  if (!test) return NextResponse.json({ error: 'Teste não encontrado' }, { status: 404 });

  return NextResponse.json(test);
}
