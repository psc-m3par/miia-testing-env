'use client';

import { useState } from 'react';
import { CriterionResult } from '@/lib/mockCorrection';

interface Props {
  criterion: CriterionResult;
}

export default function CriterionCard({ criterion }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{ backgroundColor: criterion.bgColor, borderColor: criterion.borderColor }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
            style={{ backgroundColor: criterion.color }}
          >
            {criterion.number}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{criterion.name}</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{criterion.description}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-lg font-bold text-gray-900">{criterion.score.toFixed(1)}</span>
          <span className="text-sm text-gray-500">/{criterion.maxScore}</span>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        style={{ color: criterion.color }}
      >
        {expanded ? 'Ocultar feedback' : 'Ver feedback detalhado'}
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded feedback */}
      {expanded && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Feedback do Avaliador</p>
            <p className="text-sm text-gray-700 leading-relaxed">{criterion.feedback.introduction}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pontos fortes</p>
            <ul className="space-y-1">
              {criterion.feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: criterion.color }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {criterion.feedback.improvements.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Áreas de atenção</p>
              <ul className="space-y-1">
                {criterion.feedback.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sugestão</p>
            <p className="text-sm text-gray-700 leading-relaxed">{criterion.feedback.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
