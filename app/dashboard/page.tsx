'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CreditDisplay from '@/components/CreditDisplay';
import TestHistory from '@/components/TestHistory';
import { getLocalTests, getTotalCredits } from '@/lib/localStore';
import { TestRecord } from '@/lib/types';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('miia_userId');
    if (!userId) { router.push('/'); return; }
    setUserName(localStorage.getItem('miia_userName') ?? '');
    setTotalCredits(getTotalCredits());
    setTests(getLocalTests());
    setLoaded(true);
  }, [router]);

  const usedCredits = tests.length;
  const remaining = totalCredits - usedCredits;

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
          <button
            onClick={() => router.push('/test/setup')}
            disabled={remaining <= 0}
            title={remaining <= 0 ? 'Seus créditos de teste acabaram' : undefined}
            className="px-6 py-2.5 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Novo Teste
          </button>
        </div>

        <CreditDisplay total={totalCredits} used={usedCredits} />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Histórico de Testes</h2>
          <TestHistory tests={tests} />
        </div>
      </main>
    </div>
  );
}
