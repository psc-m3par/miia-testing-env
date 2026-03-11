'use client';

import { useState } from 'react';

interface MotivatingText {
  label: string;
  content: string;
  source: string;
}

interface ThemeData {
  theme: string;
  motivatingTexts: MotivatingText[];
}

interface Props {
  theme: ThemeData;
}

export default function ContextReferences({ theme }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-semibold text-gray-800 text-sm">Contexto e referências</span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {expanded ? 'Colapsar' : 'Expandir'}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Enunciado do tema */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Enunciado do Tema</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{theme.theme}</p>
            </div>
          </div>

          {/* Textos motivadores */}
          {theme.motivatingTexts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Textos Motivadores</p>
              <div className="space-y-3">
                {theme.motivatingTexts.map((text, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-bold text-gray-600">{text.label}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{text.content}</p>
                    {text.source && (
                      <p className="text-xs text-gray-400 italic">{text.source}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
