import { TestRecord } from '@/lib/types';

interface TestCardProps {
  test: TestRecord;
  index: number;
}

export default function TestCard({ test, index }: TestCardProps) {
  const date = test.completedAt
    ? new Date(test.completedAt).toLocaleDateString('pt-BR')
    : new Date(test.startedAt).toLocaleDateString('pt-BR');

  const isCompleted = test.status === 'completed';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
          {index}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {test.criteria} {test.year}
          </p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
            ✓ Concluído
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full font-medium">
            Em andamento
          </span>
        )}
        {isCompleted && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            test.feedbackSubmitted
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {test.feedbackSubmitted ? 'Feedback enviado' : 'Feedback pendente'}
          </span>
        )}
      </div>
    </div>
  );
}
