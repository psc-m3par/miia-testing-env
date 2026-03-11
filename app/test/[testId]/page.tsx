'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import SubmissionPhase from '@/components/test/SubmissionPhase';
import ProcessingPhase from '@/components/test/ProcessingPhase';
import ResultPhase from '@/components/test/ResultPhase';

type Phase = 1 | 2 | 3;

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  const [phase, setPhase] = useState<Phase>(1);
  const [criteriaName, setCriteriaName] = useState('');
  const [year, setYear] = useState('');
  const [testDate, setTestDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Submission data persisted across phases
  const [submissionMode, setSubmissionMode] = useState<'text' | 'image'>('image');
  const [essayText, setEssayText] = useState('');
  const [essayImageUrl, setEssayImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('miia_userId');
    const name = localStorage.getItem('miia_userName') ?? '';
    setUserName(name);

    if (!userId) { router.push('/'); return; }

    fetch(`/api/test/${testId}?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.testId) {
          setCriteriaName(data.criteria ?? '');
          setYear(data.year ?? '');
          setTestDate(data.startedAt ?? new Date().toISOString());
        } else {
          router.push('/dashboard');
        }
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [testId, router]);

  function handleSubmit(mode: 'text' | 'image', text: string, imageUrl: string | null) {
    setSubmissionMode(mode);
    setEssayText(text);
    setEssayImageUrl(imageUrl);
    setPhase(2);
  }

  function handleProcessingComplete() {
    setPhase(3);
  }

  function handleComplete() {
    router.push(`/test/${testId}/feedback`);
  }

  function handleBackToDashboard() {
    router.push('/dashboard');
  }

  if (loading) {
    return (
      <>
        <Header userName={userName} subtitle="Teste em andamento" />
        <LoadingSpinner />
      </>
    );
  }

  // Phase 2: full-screen processing, no header needed
  if (phase === 2) {
    return <ProcessingPhase onComplete={handleProcessingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} subtitle="Teste em andamento" />

      {phase === 1 && (
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </button>
          <SubmissionPhase
            criteriaName={criteriaName}
            year={year}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard')}
          />
        </main>
      )}

      {phase === 3 && (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <ResultPhase
            criteriaName={criteriaName}
            year={year}
            testId={testId}
            testDate={testDate}
            mode={submissionMode}
            essayText={essayText}
            essayImageUrl={essayImageUrl}
            onComplete={handleComplete}
            onBackToDashboard={handleBackToDashboard}
          />
        </main>
      )}
    </div>
  );
}
