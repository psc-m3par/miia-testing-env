import { NextRequest, NextResponse } from 'next/server';
import { getUserByCode } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { accessCode } = await req.json();
  if (!accessCode) return NextResponse.json({ success: false, error: 'Código obrigatório' }, { status: 400 });

  const user = getUserByCode(accessCode);
  if (!user) return NextResponse.json({ success: false, error: 'Código inválido' }, { status: 401 });

  return NextResponse.json({ success: true, userId: user.id, name: user.name, totalCredits: user.totalCredits });
}
