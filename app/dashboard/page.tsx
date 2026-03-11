'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CreditDisplay from '@/components/CreditDisplay';
import TestHistory from '@/components/TestHistory';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('miia_userId');
    if (!userId) { router.push('/'); return; }

    fetch(`/api/user?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) setUser(data);
        else router.push('/');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const remaining = user ? user.totalCredits - user.usedCredits : 0;

  if (loading) return <><Header /><LoadingSpinner /></>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user?.name} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
          <button
            onClick={() => router.push('/test/setup')}
            disabled={remaining === 0}
            title={remaining === 0 ? 'Seus créditos de teste acabaram' : undefined}
            className="px-6 py-2.5 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Novo Teste
          </button>
        </div>

        {user && <CreditDisplay total={user.totalCredits} used={user.usedCredits} />}

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Histórico de Testes</h2>
          {user && <TestHistory tests={[...user.tests].reverse()} />}
        </div>
      </main>
    </div>
  );
}
