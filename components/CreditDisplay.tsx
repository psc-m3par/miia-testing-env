interface CreditDisplayProps {
  total: number;
  used: number;
}

export default function CreditDisplay({ total, used }: CreditDisplayProps) {
  const remaining = total - used;
  const pct = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        Créditos de Teste
      </h2>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-5xl font-bold text-blue-900">{remaining}</span>
        <span className="text-gray-400 text-lg mb-1">de {total} disponíveis</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining === 0 && (
        <p className="text-red-600 text-sm mt-2">Seus créditos de teste acabaram.</p>
      )}
    </div>
  );
}
