'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import DropdownSelect from '@/components/DropdownSelect';
import { Criteria } from '@/lib/types';

export default function TestSetupPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user?criteria=true')
      .then(r => r.json())
      .then(data => {
        if (data.criteria) setCriteria(data.criteria);
      });
  }, []);

  const selectedCriteriaObj = criteria.find(c => c.id === selectedCriteria);
  const yearOptions = selectedCriteriaObj
    ? selectedCriteriaObj.years.map(y => ({ value: y, label: y }))
    : [];

  async function handleStart() {
    const userId = localStorage.getItem('miia_userId');
    if (!userId) { router.push('/'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, criteria: selectedCriteriaObj?.name, year: selectedYear }),
      });
      const data = await res.json();
      if (data.success) router.push(`/test/${data.testId}`);
      else alert(data.error || 'Erro ao iniciar teste');
    } finally {
      setLoading(false);
    }
  }

  const userName = typeof window !== 'undefined' ? localStorage.getItem('miia_userName') || '' : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} />
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurar Novo Teste</h1>
            <p className="text-gray-500 mt-1">Selecione a banca e o ano para começar</p>
          </div>

          <DropdownSelect
            label="Selecione a banca corretora"
            options={criteria.map(c => ({ value: c.id, label: c.name }))}
            value={selectedCriteria}
            onChange={v => { setSelectedCriteria(v); setSelectedYear(''); }}
            placeholder="Escolha a banca..."
          />

          {selectedCriteria && (
            <DropdownSelect
              label="Selecione o ano"
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Escolha o ano..."
            />
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleStart}
              disabled={!selectedCriteria || !selectedYear || loading}
              className="flex-1 py-2.5 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Iniciando...' : 'Iniciar Teste'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
