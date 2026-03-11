'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import CriterionCard from '@/components/test/CriterionCard';
import ContextReferences from '@/components/test/ContextReferences';
import { getLocalTest } from '@/lib/localStore';
import { getMockCorrection } from '@/lib/mockCorrection';
import { TestRecord } from '@/lib/types';
import themesData from '@/data/themes.json';

interface ThemeEntry {
  criteria: string;
  year: string;
  theme: string;
  motivatingTexts: { label: string; content: string; source: string }[];
}

function downloadReport(test: TestRecord, userName: string) {
  const correction = getMockCorrection(test.criteria, test.year);
  const date = test.completedAt
    ? new Date(test.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const lines: string[] = [
    '╔══════════════════════════════════════════════════════╗',
    '║          RELATÓRIO DE CORREÇÃO — MIIA                ║',
    '╚══════════════════════════════════════════════════════╝',
    '',
    `Aluno:    ${userName}`,
    `Banca:    ${test.criteria}`,
    `Ano:      ${test.year}`,
    `Data:     ${date}`,
    `ID:       ${test.testId}`,
    '',
    '══════════════════════════════════════════════════════',
    'RESULTADO GERAL',
    '══════════════════════════════════════════════════════',
    `Nota Total:      ${correction.totalScore}/${correction.maxScore}`,
    `Percentual:      ${correction.percentage}%`,
    `Classificação:   ${correction.classification}`,
    '',
    '══════════════════════════════════════════════════════',
    'DETALHAMENTO POR CRITÉRIO',
    '══════════════════════════════════════════════════════',
  ];

  correction.criteria.forEach(c => {
    lines.push('');
    lines.push(`[${c.name}] ${c.score}/${c.maxScore}`);
    lines.push(`Descrição: ${c.description}`);
    lines.push('');
    lines.push('Introdução:');
    lines.push(c.feedback.introduction);
    lines.push('');
    lines.push('Pontos fortes:');
    c.feedback.strengths.forEach(s => lines.push(`  • ${s}`));
    if (c.feedback.improvements.length > 0) {
      lines.push('');
      lines.push('Áreas de atenção:');
      c.feedback.improvements.forEach(s => lines.push(`  • ${s}`));
    }
    lines.push('');
    lines.push('Sugestão:');
    lines.push(c.feedback.suggestion);
    lines.push('──────────────────────────────────────────────────────');
  });

  if (test.feedbackSubmitted && test.feedbackText) {
    lines.push('');
    lines.push('══════════════════════════════════════════════════════');
    lines.push('FEEDBACK DO USUÁRIO');
    lines.push('══════════════════════════════════════════════════════');
    lines.push('');
    lines.push(test.feedbackText);
  }

  lines.push('');
  lines.push('══════════════════════════════════════════════════════');
  lines.push('Gerado por MIIA — Ambiente de Testes');
  lines.push(`miia-testing-env.vercel.app`);

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MIIA_${test.criteria}_${test.year}_${test.testId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  const [test, setTest] = useState<TestRecord | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const uid = localStorage.getItem('miia_userId');
    if (!uid) { router.push('/'); return; }
    setUserName(localStorage.getItem('miia_userName') ?? '');
    const record = getLocalTest(testId);
    if (!record || record.status !== 'completed') {
      router.push('/dashboard');
      return;
    }
    setTest(record);
  }, [testId, router]);

  if (!test) return null;

  const correction = getMockCorrection(test.criteria, test.year);
  const themeEntry = (themesData.themes as ThemeEntry[]).find(
    t => t.criteria.toUpperCase() === test.criteria.toUpperCase() && t.year === test.year,
  );

  const date = test.completedAt
    ? new Date(test.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const scoreColor = correction.percentage >= 80 ? 'text-green-700' : correction.percentage >= 60 ? 'text-yellow-700' : 'text-red-700';
  const badgeBg = correction.percentage >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resultado — {test.criteria} {test.year}</h1>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
          </div>
          <button
            onClick={() => downloadReport(test, userName)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar Relatório
          </button>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
          <div className="w-1.5 bg-green-500 flex-shrink-0" />
          <div className="flex-1 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Resultado Geral</p>
              <p className="text-sm text-gray-500">{correction.criteria.length} critérios · {date}</p>
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

        {/* Context references */}
        {themeEntry && <ContextReferences theme={themeEntry} />}

        {/* Criteria */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Detalhamento por Critério</h2>
          <div className="space-y-3">
            {correction.criteria.map(c => (
              <CriterionCard key={c.number} criterion={c} />
            ))}
          </div>
        </div>

        {/* User feedback */}
        {test.feedbackSubmitted && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h2 className="text-sm font-semibold text-gray-700">Seu Feedback</h2>
            </div>
            {test.feedbackText ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{test.feedbackText}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Feedback enviado (texto não disponível)</p>
            )}
          </div>
        )}

        {/* Download CTA */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">Baixe seu relatório completo</p>
            <p className="text-xs text-blue-600 mt-0.5">Inclui todos os critérios, feedbacks e sua avaliação</p>
          </div>
          <button
            onClick={() => downloadReport(test, userName)}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Baixar .txt
          </button>
        </div>

      </main>
    </div>
  );
}
