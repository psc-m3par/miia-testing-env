'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';

export default function TestPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  async function handleComplete() {
    const userId = localStorage.getItem('miia_userId');
    if (!userId) { router.push('/'); return; }
    setLoading(true);
    try {
      await fetch('/api/test/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, userId }),
      });
      router.push(`/test/${testId}/feedback`);
    } finally {
      setLoading(false);
    }
  }

  const userName = typeof window !== 'undefined' ? localStorage.getItem('miia_userName') || '' : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} subtitle="Teste em andamento" />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Área de Teste de Correção de Redação</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-gray-700 text-sm">{minutes}:{seconds}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              📝 Área de teste — cole ou digite sua redação abaixo para correção
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Esta é uma versão de demonstração. A análise completa estará disponível em breve.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sua redação</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Digite ou cole sua redação aqui..."
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{text.split(/\s+/).filter(Boolean).length} palavras</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Concluindo...' : 'Concluir Teste →'}
          </button>
        </div>
      </main>
    </div>
  );
}
