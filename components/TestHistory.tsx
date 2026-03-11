import { TestRecord } from '@/lib/types';
import TestCard from './TestCard';

interface TestHistoryProps {
  tests: TestRecord[];
}

export default function TestHistory({ tests }: TestHistoryProps) {
  if (tests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-lg font-medium text-gray-500">Nenhum teste realizado ainda.</p>
        <p className="text-sm mt-1">Clique em &ldquo;Novo Teste&rdquo; para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tests.map((test, idx) => (
        <TestCard key={test.testId} test={test} index={idx + 1} />
      ))}
    </div>
  );
}
