'use client';

import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const TOTAL_DURATION = 16;

const STEPS = [
  { until: 3, title: 'Enviando seu texto...', badge: 'Enviando', message: 'Enviando suas imagens para processamento. Aguarde um momento...' },
  { until: 8, title: 'Extraindo texto...', badge: 'Em processamento', message: 'Estamos extraindo o texto das suas imagens com OCR. Isso pode levar alguns segundos...' },
  { until: 13, title: 'Analisando redação...', badge: 'Em processamento', message: 'Analisando a redação com base nos critérios selecionados...' },
  { until: 16, title: 'Gerando correção...', badge: 'Finalizando', message: 'Gerando o resultado detalhado da correção...' },
];

function getStep(elapsed: number) {
  return STEPS.find(s => elapsed < s.until) ?? STEPS[STEPS.length - 1];
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ProcessingPhase({ onComplete }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= TOTAL_DURATION) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  const step = getStep(elapsed);
  const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

  const badgeColor =
    step.badge === 'Enviando'
      ? 'bg-blue-100 text-blue-700'
      : step.badge === 'Finalizando'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-md space-y-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
            {step.badge}
          </span>
        </div>

        {/* Timer */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tempo decorrido: {formatTime(elapsed)}</span>
            <span>Máximo: 2:30</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center">{step.message}</p>

        {/* Sub-status */}
        <p className="text-xs text-gray-400 text-center">Processando...</p>
      </div>
    </div>
  );
}
