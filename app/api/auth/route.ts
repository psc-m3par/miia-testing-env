import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MOCK_PASSWORD = 'miia123';
const TOTAL_CREDITS = 5;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

// Deterministic userId from email so the same email always gets the same ID
function userIdFromEmail(email: string): string {
  return 'u_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || !isValidEmail(email) || password !== MOCK_PASSWORD) {
    return NextResponse.json({ success: false, error: 'Credenciais inválidas' }, { status: 401 });
  }

  const userId = userIdFromEmail(email);
  const name = nameFromEmail(email);

  return NextResponse.json({ success: true, userId, name, totalCredits: TOTAL_CREDITS });
}
