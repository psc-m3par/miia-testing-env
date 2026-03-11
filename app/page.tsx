'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // If switching users, clear previous test data
        const prevId = localStorage.getItem('miia_userId');
        if (prevId && prevId !== data.userId) {
          localStorage.removeItem('miia_tests');
        }
        localStorage.setItem('miia_userId', data.userId);
        localStorage.setItem('miia_userName', data.name);
        localStorage.setItem('miia_totalCredits', String(data.totalCredits ?? 5));
        router.push('/dashboard');
      } else {
        setError('Código de acesso inválido. Verifique e tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-900">MIIA</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Ambiente de Testes</h2>
          <p className="text-gray-500 mt-1">Insira seu código de acesso para começar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de acesso
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="MIIA-XXXX-XXXX-XXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
