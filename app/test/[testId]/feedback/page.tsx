'use client';

import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import FeedbackForm from '@/components/FeedbackForm';
import { useState } from 'react';
import { updateLocalTest } from '@/lib/localStore';

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  const userName = typeof window !== 'undefined' ? localStorage.getItem('miia_userName') || '' : '';

  async function handleSubmit(textFeedback: string) {
    const userId = localStorage.getItem('miia_userId');
    if (!userId) { router.push('/'); return; }
    setLoading(true);
    try {
      updateLocalTest(testId, { feedbackSubmitted: true, feedbackText: textFeedback });
      // Send to API (best-effort, won't persist on serverless but logs the intent)
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, testId, textFeedback, fields: {} }),
      }).catch(() => {});
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} />
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-500 mt-1">Sugestões de melhoria</p>
          </div>
          <FeedbackForm onSubmit={handleSubmit} onSkip={handleSkip} loading={loading} />
        </div>
      </main>
    </div>
  );
}
