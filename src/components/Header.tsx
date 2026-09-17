interface HeaderProps {
  currentPage: 'calculator' | 'admin';
  onNavigate: (page: 'calculator' | 'admin') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Вася Сварщик 🤣</h1>
            <p className="text-xs text-slate-400">Расчёт сварных изделий</p>
          </div>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={() => onNavigate('calculator')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'calculator'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            🔧 Калькулятор
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'admin'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            ⚙️ Админка
          </button>
        </nav>
      </div>
    </header>
  );
}
