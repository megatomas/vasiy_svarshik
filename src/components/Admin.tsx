import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/calculator';

export function Admin() {
  const { isAdminAuthenticated, login, logout, settings, updateSettings, calculations, updateCalculationStatus } = useStore();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'prices' | 'work' | 'coefficients' | 'additional' | 'calculations'>('prices');

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Админ-панель</h2>
            <p className="text-slate-400 text-sm mt-1">Войдите для управления настройками</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Логин"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              onClick={() => {
                if (login(loginForm.username, loginForm.password)) {
                  setLoginError('');
                } else {
                  setLoginError('Неверный логин или пароль');
                }
              }}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">⚙️ Админ-панель</h2>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-all"
        >
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'prices', label: '💰 Цены труб' },
          { key: 'work', label: '🔧 Стоимость работ' },
          { key: 'coefficients', label: '📊 Коэффициенты' },
          { key: 'additional', label: '➕ Доп. работы' },
          { key: 'calculations', label: '📋 Расчёты' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-700/50 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        {activeTab === 'prices' && <PricesTab settings={settings} updateSettings={updateSettings} />}
        {activeTab === 'work' && <WorkTab settings={settings} updateSettings={updateSettings} />}
        {activeTab === 'coefficients' && <CoefficientsTab settings={settings} updateSettings={updateSettings} />}
        {activeTab === 'additional' && <AdditionalTab settings={settings} updateSettings={updateSettings} />}
        {activeTab === 'calculations' && <CalculationsTab calculations={calculations} updateStatus={updateCalculationStatus} />}
      </div>
    </div>
  );
}

// === Prices Tab ===
function PricesTab({ settings, updateSettings }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);

  const handleSave = (id: string) => {
    const updated = settings.pipes.map((p: any) =>
      p.id === id ? { ...p, pricePerMeter: editPrice } : p
    );
    updateSettings({ pipes: updated });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Цены профильных труб</h3>
      <div className="space-y-2">
        {settings.pipes.map((pipe: any) => (
          <div key={pipe.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <div>
              <span className="font-medium">{pipe.name}</span>
              <span className="text-sm text-slate-400 ml-2">стенка {pipe.wallThickness} мм</span>
            </div>
            {editingId === pipe.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-24 px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                />
                <span className="text-sm text-slate-400">₽/м</span>
                <button onClick={() => handleSave(pipe.id)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30">✓</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-slate-600/50 text-slate-400 rounded-lg text-sm hover:bg-slate-600">✗</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingId(pipe.id); setEditPrice(pipe.pricePerMeter); }}
                className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30"
              >
                {formatPrice(pipe.pricePerMeter)}/м ✏️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// === Work Tab ===
function WorkTab({ settings, updateSettings }: any) {
  const updateRate = (type: string, key: string, value: number) => {
    if (type === 'welding') {
      updateSettings({ weldingRates: { ...settings.weldingRates, [key]: value } });
    } else if (type === 'grinding') {
      updateSettings({ grindingRates: { ...settings.grindingRates, [key]: value } });
    } else if (type === 'paint') {
      updateSettings({ paintRates: { ...settings.paintRates, [key]: value } });
    } else if (type === 'prep') {
      updateSettings({ surfacePrepRates: { ...settings.surfacePrepRates, [key]: value } });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3">Стоимость сварки (₽/час)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(settings.weldingRates).map(([key, value]) => (
            <div key={key} className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <label className="text-sm text-slate-400 block mb-1">{key}</label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => updateRate('welding', key, Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Зачистка (₽)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(settings.grindingRates).map(([key, value]) => (
            <div key={key} className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <label className="text-sm text-slate-400 block mb-1">{key}</label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => updateRate('grinding', key, Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Покраска (₽)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(settings.paintRates).map(([key, value]) => (
            <div key={key} className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <label className="text-sm text-slate-400 block mb-1">{key}</label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => updateRate('paint', key, Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Подготовка поверхности (₽)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(settings.surfacePrepRates).map(([key, value]) => (
            <div key={key} className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <label className="text-sm text-slate-400 block mb-1">{key}</label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => updateRate('prep', key, Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === Coefficients Tab ===
function CoefficientsTab({ settings, updateSettings }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3">Коэффициенты сложности</h3>
        <div className="space-y-3">
          {settings.difficultyCoefficients.map((coeff: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <span className="font-medium">{coeff.level}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">×</span>
                <input
                  type="number"
                  step="0.1"
                  value={coeff.coefficient}
                  onChange={(e) => {
                    const updated = [...settings.difficultyCoefficients];
                    updated[i] = { ...updated[i], coefficient: Number(e.target.value) };
                    updateSettings({ difficultyCoefficients: updated });
                  }}
                  className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Наценка (%)</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={settings.markupPercent}
            onChange={(e) => updateSettings({ markupPercent: Number(e.target.value) })}
            className="w-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-amber-500/50"
          />
          <span className="text-slate-400">%</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Эта наценка скрыта от клиента и применяется к расчётной себестоимости</p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Диапазон цены (%)</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={settings.priceRangePercent}
            onChange={(e) => updateSettings({ priceRangePercent: Number(e.target.value) })}
            className="w-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-amber-500/50"
          />
          <span className="text-slate-400">± %</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Клиенту показывается диапазон: цена ± этот процент</p>
      </div>
    </div>
  );
}

// === Additional Works Tab ===
function AdditionalTab({ settings, updateSettings }: any) {
  const updateWork = (id: string, field: string, value: any) => {
    const updated = settings.additionalWorks.map((w: any) =>
      w.id === id ? { ...w, [field]: value } : w
    );
    updateSettings({ additionalWorks: updated });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Дополнительные работы</h3>
      <div className="space-y-2">
        {settings.additionalWorks.map((work: any) => (
          <div key={work.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <span className="font-medium">{work.name}</span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={work.price}
                onChange={(e) => updateWork(work.id, 'price', Number(e.target.value))}
                className="w-28 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
              />
              <span className="text-sm text-slate-400">₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === Calculations Tab ===
function CalculationsTab({ calculations, updateStatus }: any) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'Новый', color: 'text-blue-400 bg-blue-500/20' },
    in_progress: { label: 'В работе', color: 'text-amber-400 bg-amber-500/20' },
    done: { label: 'Готов', color: 'text-green-400 bg-green-500/20' },
  };

  if (calculations.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">Пока нет расчётов</p>
        <p className="text-sm mt-1">Расчёты появятся здесь после использования калькулятора</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">История расчётов</h3>
      <div className="space-y-3">
        {calculations.map((calc: any) => {
          const productName = calc.data.productType === 'Другое' ? calc.data.customProduct : calc.data.productType;
          const status = statusLabels[calc.status];
          return (
            <div key={calc.id} className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-amber-400">{calc.id}</span>
                  <span className="ml-3 font-medium">{productName}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {new Date(calc.date).toLocaleDateString('ru-RU')} • {calc.data.length}×{calc.data.width}×{calc.data.height} мм
                </span>
                <span className="font-bold text-white">{formatPrice(calc.clientPrice)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {(['new', 'in_progress', 'done'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(calc.id, s)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      calc.status === s
                        ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                        : 'bg-slate-600/30 text-slate-400 hover:bg-slate-600/50'
                    }`}
                  >
                    {statusLabels[s].label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
