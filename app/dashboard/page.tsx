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
        {/* Disclaimers */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-blue-900">Sobre este ambiente de testes</p>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Este ambiente apresenta uma amostra das funcionalidades padrão da plataforma MIIA. Os parâmetros de correção, critérios de avaliação, formato do feedback e formulário de coleta exibidos são configurações de exemplo baseadas no padrão ENEM — na versão final, todos esses elementos podem ser totalmente personalizados conforme as necessidades da sua instituição. O conteúdo, nível de detalhe, tom das respostas e campos de avaliação são adaptáveis a qualquer banca ou metodologia de correção.
          </p>
        </div>

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
