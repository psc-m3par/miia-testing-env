'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName?: string;
  subtitle?: string;
}

export default function Header({ userName, subtitle }: HeaderProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('miia_userId');
    localStorage.removeItem('miia_userName');
    router.push('/');
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <div>
            <span className="text-blue-900 font-bold text-lg">MIIA</span>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {userName && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
