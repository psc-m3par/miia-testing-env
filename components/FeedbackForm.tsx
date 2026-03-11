'use client';

import { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (text: string) => Promise<void>;
  onSkip: () => void;
  loading: boolean;
}

export default function FeedbackForm({ onSubmit, onSkip, loading }: FeedbackFormProps) {
  const [text, setText] = useState('');

  return (
    <div className="space-y-5">
      {/* Info note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-blue-700 leading-relaxed">
          Lembre-se: todo o conteúdo da correção — critérios, formato de feedback, nível de detalhe e tom das respostas — pode ser totalmente personalizado para atender às necessidades específicas da sua instituição.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suas impressões <span className="text-red-500">*</span>
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Compartilhe suas impressões sobre o teste..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSubmit(text)}
          disabled={loading || !text.trim()}
          className="flex-1 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enviando...' : 'Enviar Feedback'}
        </button>
        <button
          onClick={onSkip}
          disabled={loading}
          className="px-6 py-3 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          Pular
        </button>
      </div>
    </div>
  );
}
