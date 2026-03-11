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
    <div className="space-y-6">
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

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Campos adicionais de avaliação serão incluídos em breve</p>
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
