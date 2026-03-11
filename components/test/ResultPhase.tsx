'use client';

import { useState } from 'react';
import { getMockCorrection } from '@/lib/mockCorrection';
import CriterionCard from './CriterionCard';
import EssayViewer from './EssayViewer';
import ContextReferences from './ContextReferences';
import themesData from '@/data/themes.json';
import { updateLocalTest } from '@/lib/localStore';

interface ThemeEntry {
  criteria: string;
  year: string;
  theme: string;
  motivatingTexts: { label: string; content: string; source: string }[];
}

interface Props {
  criteriaName: string;
  year: string;
  testId: string;
  testDate: string;
  mode: 'text' | 'image';
  essayText: string;
  essayImageUrl: string | null;
  onComplete: () => void;
  onBackToDashboard: () => void;
}

export default function ResultPhase({
  criteriaName,
  year,
  testId,
  testDate,
  mode,
  essayText,
  essayImageUrl,
  onComplete,
  onBackToDashboard,
}: Props) {
  const [completing, setCompleting] = useState(false);

  const correction = getMockCorrection(criteriaName, year);
  const themeEntry = (themesData.themes as ThemeEntry[]).find(
    t => t.criteria.toUpperCase() === criteriaName.toUpperCase() && t.year === year,
  );

  const scoreColor =
    correction.percentage >= 80
      ? 'text-green-700'
      : correction.percentage >= 60
      ? 'text-yellow-700'
      : 'text-red-700';

  const badgeBg =
    correction.percentage >= 80
      ? 'bg-green-100 text-green-700'
      : correction.percentage >= 60
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  async function handleComplete(dest: 'feedback' | 'dashboard') {
    setCompleting(true);
    updateLocalTest(testId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
    if (dest === 'feedback') onComplete();
    else onBackToDashboard();
  }

  const formattedDate = new Date(testDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Correção de Redação</h1>
          <p className="text-sm text-gray-500 mt-0.5">Análise detalhada por critério</p>
        </div>
        <button
          disabled
          className="px-4 py-2 bg-purple-100 text-purple-400 text-sm font-medium rounded-xl cursor-not-allowed"
          title="Não disponível no ambiente de teste"
        >
          Nova Correção
        </button>
      </div>

      {/* Resultado Geral card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
        <div className="w-1.5 bg-green-500 flex-shrink-0" />
        <div className="flex-1 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Resultado Geral</p>
            <p className="text-sm text-gray-500">
              {correction.criteria.length} critérios · {formattedDate}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${scoreColor}`}>
              {correction.totalScore.toFixed(1)}
              <span className="text-base font-normal text-gray-400"> /{correction.maxScore}</span>
            </p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-sm font-medium ${badgeBg}`}>
              {correction.classification} · {correction.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Contexto e referências */}
      {themeEntry && <ContextReferences theme={themeEntry} />}

      {/* Two-column main area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Essay viewer */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Redação Original</h2>
          <EssayViewer
            mode={mode}
            essayText={essayText}
            essayImageUrl={essayImageUrl}
            criteria={correction.criteria}
            testId={testId}
          />

          {/* Color legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Legenda</p>
            <div className="space-y-1.5">
              {correction.criteria.map(c => (
                <div key={c.number} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color + '99' }} />
                  <span className="text-xs text-gray-600">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Criterion cards + actions */}
        <div className="lg:col-span-3 space-y-3">
          {correction.criteria.map(c => (
            <CriterionCard key={c.number} criterion={c} />
          ))}

          {/* Action buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => handleComplete('feedback')}
              disabled={completing}
              className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {completing ? 'Aguarde...' : 'Concluir Teste e Enviar Feedback'}
            </button>
            <button
              onClick={() => handleComplete('dashboard')}
              disabled={completing}
              className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
