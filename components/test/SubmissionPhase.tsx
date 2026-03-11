'use client';

import { useState, useRef } from 'react';
import themesData from '@/data/themes.json';

interface ThemeEntry {
  criteria: string;
  year: string;
  theme: string;
}

interface Props {
  criteriaName: string;
  year: string;
  onSubmit: (mode: 'text' | 'image', text: string, imageUrl: string | null) => void;
  onCancel: () => void;
}

function getTheme(criteria: string, year: string): string {
  const entry = (themesData.themes as ThemeEntry[]).find(
    t => t.criteria.toUpperCase() === criteria.toUpperCase() && t.year === year,
  );
  return entry?.theme ?? 'Tema não disponível';
}

export default function SubmissionPhase({ criteriaName, year, onSubmit, onCancel }: Props) {
  const [mode, setMode] = useState<'image' | 'text'>('image');
  const [essayText, setEssayText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = getTheme(criteriaName, year);
  const canSubmit = mode === 'image' ? imageFile !== null : essayText.trim().length >= 100;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setProcessed(false);
    const reader = new FileReader();
    reader.onload = ev => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setImageFile(file);
    setProcessed(false);
    const reader = new FileReader();
    reader.onload = ev => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleProcessImages() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
    }, 2000);
  }

  function handleSubmit() {
    setSubmitting(true);
    onSubmit(mode, essayText, imageUrl);
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-4">
      {/* Card 1: Proposta de Redação */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Proposta de Redação</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Provas */}
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-gray-700">Provas</p>
            <p className="text-xs text-gray-500">Escolha uma prova para corrigir</p>
            <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
              {criteriaName || '—'}
            </span>
          </div>

          {/* Temas */}
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-gray-700">Temas</p>
            <p className="text-xs text-gray-500">Escolha um tema para a redação</p>
            <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200 leading-snug">
              {theme}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Submissão */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">Submissão de Redação</h2>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              mode === 'text'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Digitar Texto
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              mode === 'image'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload de Imagens
          </button>
        </div>

        {/* Upload mode */}
        {mode === 'image' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Upload de Imagens (manuscrito)</p>

              {!imageFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                >
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Clique para adicionar imagens ou arraste aqui</p>
                  <p className="text-xs text-gray-400 mt-1">Suporta: JPG, PNG, HEIC, WEBP · Máx: 4.5MB por imagem · Até 1 imagem</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/heic,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                    {imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="Redação" className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{imageFile.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(imageFile.size)}</p>
                    </div>
                    <button
                      onClick={() => { setImageFile(null); setImageUrl(null); setProcessed(false); }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Processar imagens bar */}
                  <div className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Extrair Texto das Imagens</p>
                      <p className="text-xs text-gray-500">
                        {processed
                          ? 'Texto extraído com sucesso!'
                          : 'Processe as imagens para extrair o texto automaticamente'}
                      </p>
                    </div>
                    <button
                      onClick={handleProcessImages}
                      disabled={processing || processed}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      {processing ? 'Processando...' : processed ? 'Concluído ✓' : 'Processar Imagens'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text mode */}
        {mode === 'text' && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Texto da redação</p>
            <textarea
              value={essayText}
              onChange={e => setEssayText(e.target.value)}
              placeholder="Digite ou cole o texto da sua redação aqui..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
            <p className={`text-xs mt-1 text-right ${essayText.trim().length >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
              {essayText.trim().length} / 100 caracteres mínimos
            </p>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {submitting ? 'Enviando...' : 'Enviar para Correção'}
          </button>
          {!canSubmit && (
            <p className="text-xs text-gray-400">Preencha todos os campos</p>
          )}
        </div>
      </div>
    </div>
  );
}
