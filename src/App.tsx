import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { Admin } from './components/Admin';
import { Header } from './components/Header';

function App() {
  const [page, setPage] = useState<'calculator' | 'admin'>('calculator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {page === 'calculator' ? <Calculator /> : <Admin />}
      </main>
      <footer className="border-t border-slate-700/50 mt-16 py-6 text-center text-slate-400 text-sm">
        <p>Конфигуратор сварных изделий • Ориентировочный расчёт стоимости</p>
      </footer>
    </div>
  );
}

export default App;
