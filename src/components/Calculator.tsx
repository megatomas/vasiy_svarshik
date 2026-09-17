import { useState } from 'react';
import { useStore } from '../store/useStore';
import { productTypes, getProductFields, wallThicknesses } from '../data/defaults';
import { calculatePrice, formatPrice, generateId } from '../utils/calculator';
import { CalculationResult } from '../types';

const STEPS = [
  'Тип изделия',
  'Габариты',
  'Профильная труба',
  'Конструкция',
  'Сварка и работа',
  'Обработка',
  'Доп. работы',
  'Результат',
];

export function Calculator() {
  const { calculatorData, setCalculatorData, currentStep, setCurrentStep, settings, addCalculation, resetCalculator } = useStore();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', telegram: '', comment: '' });
  const [lastResult, setLastResult] = useState<CalculationResult | null>(null);

  const fields = getProductFields(calculatorData.productType);

  const handleCalculate = () => {
    const calcData = calculatePrice(calculatorData, settings);
    const result: CalculationResult = {
      ...calcData,
      id: generateId(),
      date: new Date().toISOString(),
      status: 'new',
    };
    setLastResult(result);
    addCalculation(result);
    setCurrentStep(7);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!calculatorData.productType || !!calculatorData.customProduct;
      case 1: return true;
      case 2: return calculatorData.selectedPipe !== '' && calculatorData.pipeMeters > 0;
      case 3: return calculatorData.workHours > 0;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 6) {
      handleCalculate();
    } else if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNewCalculation = () => {
    resetCalculator();
    setLastResult(null);
    setShowContactForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Шаг {currentStep + 1} из {STEPS.length}</span>
          <span className="text-sm font-medium text-amber-400">{STEPS[currentStep]}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= currentStep ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 min-h-[400px]">
        {currentStep === 0 && <StepProductType data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 1 && <StepDimensions data={calculatorData} setData={setCalculatorData} fields={fields} />}
        {currentStep === 2 && <StepPipe data={calculatorData} setData={setCalculatorData} settings={settings} />}
        {currentStep === 3 && <StepConstruction data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 4 && <StepWelding data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 5 && <StepProcessing data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 6 && <StepAdditionalWorks data={calculatorData} setData={setCalculatorData} settings={settings} />}
        {currentStep === 7 && lastResult && (
          <StepResult 
            result={lastResult} 
            showContactForm={showContactForm}
            setShowContactForm={setShowContactForm}
            contactForm={contactForm}
            setContactForm={setContactForm}
            onNewCalculation={handleNewCalculation}
          />
        )}
      </div>

      {/* Navigation */}
      {currentStep < 7 && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl bg-slate-700 text-slate-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all"
          >
            ← Назад
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
          >
            {currentStep === 6 ? '📊 Рассчитать стоимость' : 'Далее →'}
          </button>
        </div>
      )}
    </div>
  );
}

// === STEP 0: Product Type ===
function StepProductType({ data, setData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Что изготавливаем?</h2>
        <p className="text-slate-400">Выберите тип сварного изделия</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {productTypes.map(type => (
          <button
            key={type}
            onClick={() => setData({ productType: type })}
            className={`p-4 rounded-xl border text-sm font-medium transition-all ${
              data.productType === type
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      {data.productType === 'Другое' && (
        <div>
          <label className="block text-sm text-slate-400 mb-2">Укажите название изделия</label>
          <input
            type="text"
            value={data.customProduct}
            onChange={(e) => setData({ customProduct: e.target.value })}
            placeholder="Например: Беседка, Теплица..."
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          />
        </div>
      )}
    </div>
  );
}

// === STEP 1: Dimensions ===
function StepDimensions({ data, setData, fields }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Габариты изделия</h2>
        <p className="text-slate-400">Укажите размеры в миллиметрах</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.showLength && (
          <DimensionInput label="Длина" value={data.length} onChange={(v: number) => setData({ length: v })} />
        )}
        {fields.showWidth && (
          <DimensionInput label="Ширина" value={data.width} onChange={(v: number) => setData({ width: v })} />
        )}
        {fields.showHeight && (
          <DimensionInput label="Высота" value={data.height} onChange={(v: number) => setData({ height: v })} />
        )}
        {fields.showLegs && (
          <DimensionInput label="Количество ножек" value={data.legs} onChange={(v: number) => setData({ legs: v })} suffix="шт" />
        )}
        {fields.showSections && (
          <DimensionInput label="Количество секций" value={data.sections} onChange={(v: number) => setData({ sections: v })} suffix="шт" />
        )}
        {fields.showWings && (
          <DimensionInput label="Количество створок" value={data.wings} onChange={(v: number) => setData({ wings: v })} suffix="шт" />
        )}
        <DimensionInput label="Количество изделий" value={data.quantity} onChange={(v: number) => setData({ quantity: v })} suffix="шт" />
      </div>
    </div>
  );
}

function DimensionInput({ label, value, onChange, suffix = 'мм' }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{suffix}</span>
      </div>
    </div>
  );
}

// === STEP 2: Pipe Selection ===
function StepPipe({ data, setData, settings }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Профильная труба</h2>
        <p className="text-slate-400">Выберите тип профиля и укажите необходимое количество</p>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Тип профиля</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {settings.pipes.map((pipe: any) => (
            <button
              key={pipe.id}
              onClick={() => setData({ selectedPipe: pipe.id })}
              className={`p-3 rounded-xl border text-sm transition-all ${
                data.selectedPipe === pipe.id
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div className="font-medium">{pipe.name}</div>
              <div className="text-xs text-slate-500 mt-1">{pipe.wallThickness} мм • {pipe.pricePerMeter} ₽/м</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Толщина стенки</label>
          <select
            value={data.wallThickness}
            onChange={(e) => setData({ wallThickness: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
          >
            {wallThicknesses.map(t => (
              <option key={t} value={t}>{t} мм</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Количество трубы (погонных метров)</label>
          <div className="relative">
            <input
              type="number"
              value={data.pipeMeters}
              onChange={(e) => setData({ pipeMeters: Number(e.target.value) })}
              className="w-full px-4 py-3 pr-10 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">м</span>
          </div>
        </div>
      </div>

      {data.selectedPipe && (
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <p className="text-sm text-slate-400">
            💡 Стоимость трубы: <span className="text-amber-400 font-medium">
              {formatPrice(data.pipeMeters * (settings.pipes.find((p: any) => p.id === data.selectedPipe)?.pricePerMeter || 0))}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// === STEP 3: Construction / Work Hours ===
function StepConstruction({ data, setData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Конструкция и работа</h2>
        <p className="text-slate-400">Укажите примерное время изготовления</p>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 mb-4">
        <p className="text-sm text-slate-300">
          💡 Если не знаете точное количество часов, укажите примерное время. 
          Для простого изделия — 3-5 часов, для среднего — 6-10 часов, для сложного — 12+ часов.
        </p>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">Расчётное время изготовления</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="40"
            value={data.workHours}
            onChange={(e) => setData({ workHours: Number(e.target.value) })}
            className="flex-1 accent-amber-500"
          />
          <span className="text-xl font-bold text-amber-400 min-w-[60px] text-center">{data.workHours} ч</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1 час</span>
          <span>40 часов</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">Стоимость расходных материалов</label>
        <div className="relative">
          <input
            type="number"
            value={data.consumablesCost}
            onChange={(e) => setData({ consumablesCost: Number(e.target.value) })}
            className="w-full px-4 py-3 pr-10 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₽</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Электроды/проволока, диски, газ и т.д.</p>
      </div>
    </div>
  );
}

// === STEP 4: Welding ===
function StepWelding({ data, setData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Сварка</h2>
        <p className="text-slate-400">Укажите тип и сложность сварочных работ</p>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Тип сварки</label>
        <div className="grid grid-cols-3 gap-3">
          {(['MIG/MAG', 'MMA', 'TIG'] as const).map(type => (
            <button
              key={type}
              onClick={() => setData({ weldingType: type })}
              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                data.weldingType === type
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Сложность сварки</label>
        <div className="grid grid-cols-3 gap-3">
          {(['Простая', 'Средняя', 'Сложная'] as const).map(level => (
            <button
              key={level}
              onClick={() => setData({ weldingComplexity: level })}
              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                data.weldingComplexity === level
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Общая сложность изделия</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['Простая', 'Средняя', 'Сложная', 'Очень сложная'] as const).map(level => (
            <button
              key={level}
              onClick={() => setData({ difficultyLevel: level })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                data.difficultyLevel === level
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// === STEP 5: Processing ===
function StepProcessing({ data, setData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Обработка изделия</h2>
        <p className="text-slate-400">Выберите тип обработки поверхности</p>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Зачистка сварных швов</label>
        <div className="grid grid-cols-3 gap-3">
          {(['Нет', 'Частичная', 'Полная'] as const).map(level => (
            <button
              key={level}
              onClick={() => setData({ grindingLevel: level })}
              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                data.grindingLevel === level
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">Покраска</label>
        <div className="grid grid-cols-2 gap-3">
          {(['Без покраски', 'Грунтовка', 'Грунт + эмаль', 'Порошковая окраска'] as const).map(type => (
            <button
              key={type}
              onClick={() => setData({ paintType: type })}
              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                data.paintType === type
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {data.paintType !== 'Без покраски' && (
        <div>
          <label className="block text-sm text-slate-400 mb-2">Цвет</label>
          <div className="flex flex-wrap gap-2">
            {['Чёрный', 'Белый', 'Серый', 'Коричневый', 'Зелёный', 'Синий', 'Красный', 'RAL'].map(color => (
              <button
                key={color}
                onClick={() => setData({ paintColor: color })}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  data.paintColor === color
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-400 mb-3">Подготовка поверхности</label>
        <div className="grid grid-cols-2 gap-3">
          {(['Без обработки', 'Зачистка', 'Обезжиривание', 'Пескоструй'] as const).map(type => (
            <button
              key={type}
              onClick={() => setData({ surfacePrep: type })}
              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                data.surfacePrep === type
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// === STEP 6: Additional Works ===
function StepAdditionalWorks({ data, setData, settings }: any) {
  const toggleWork = (workId: string) => {
    const current = data.additionalWorks as string[];
    if (current.includes(workId)) {
      setData({ additionalWorks: current.filter((id: string) => id !== workId) });
    } else {
      setData({ additionalWorks: [...current, workId] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Дополнительные работы</h2>
        <p className="text-slate-400">Выберите необходимые операции</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {settings.additionalWorks.map((work: any) => (
          <button
            key={work.id}
            onClick={() => toggleWork(work.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              data.additionalWorks.includes(work.id)
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{work.name}</span>
              <span className="text-sm opacity-70">{formatPrice(work.price)}</span>
            </div>
            {data.additionalWorks.includes(work.id) && (
              <span className="text-xs mt-1">✓ Выбрано</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
        <p className="text-sm text-slate-400">
          💡 После выбора всех параметров нажмите «Рассчитать стоимость» для получения ориентировочной цены.
        </p>
      </div>
    </div>
  );
}

// === STEP 7: Result ===
function StepResult({ result, showContactForm, setShowContactForm, contactForm, setContactForm, onNewCalculation }: {
  result: CalculationResult;
  showContactForm: boolean;
  setShowContactForm: (v: boolean) => void;
  contactForm: { name: string; phone: string; telegram: string; comment: string };
  setContactForm: (v: any) => void;
  onNewCalculation: () => void;
}) {
  const productName = result.data.productType === 'Другое' ? result.data.customProduct : result.data.productType;
  const pipe = useStore.getState().settings.pipes.find(p => p.id === result.data.selectedPipe);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">Ваш расчёт готов</h2>
        <p className="text-slate-400">Расчёт №{result.id}</p>
      </div>

      {/* Product Info */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <h3 className="font-bold text-lg mb-3 text-amber-400">{productName}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {result.data.length > 0 && <span className="text-slate-400">Длина: <span className="text-white">{result.data.length} мм</span></span>}
          {result.data.width > 0 && <span className="text-slate-400">Ширина: <span className="text-white">{result.data.width} мм</span></span>}
          {result.data.height > 0 && <span className="text-slate-400">Высота: <span className="text-white">{result.data.height} мм</span></span>}
          <span className="text-slate-400">Количество: <span className="text-white">{result.data.quantity} шт</span></span>
          {pipe && <span className="text-slate-400">Профиль: <span className="text-white">{pipe.name}×{pipe.wallThickness}</span></span>}
          <span className="text-slate-400">Труба: <span className="text-white">{result.data.pipeMeters} м</span></span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <h3 className="font-bold mb-4">Расчёт стоимости</h3>
        <div className="space-y-3">
          <CostRow label="Материалы" value={result.materialsCost} />
          <CostRow label="Работа (сварка)" value={result.workCost} />
          <CostRow label="Расходники" value={result.consumablesCost} />
          <CostRow label="Обработка" value={result.processingCost} />
          {result.additionalWorksCost > 0 && <CostRow label="Доп. работы" value={result.additionalWorksCost} />}
          <div className="border-t border-slate-600 pt-3">
            <CostRow label="Себестоимость" value={result.totalCost} bold />
          </div>
          <div className="text-sm text-slate-500">
            Коэффициент сложности: ×{result.difficultyCoefficient}
          </div>
          <CostRow label="Расчётная стоимость" value={result.adjustedCost} bold />
        </div>
      </div>

      {/* Final Price */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/30 text-center">
        <p className="text-sm text-amber-300 mb-2">Ориентировочная стоимость изготовления</p>
        <p className="text-3xl font-bold text-white">
          {formatPrice(result.priceRange[0])} — {formatPrice(result.priceRange[1])}
        </p>
        <p className="text-xs text-slate-400 mt-3">
          Итоговая стоимость зависит от конструкции, расхода материалов, сложности сварочных работ и дополнительных требований.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowContactForm(true)}
          className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
        >
          📋 Получить точный расчёт
        </button>
        <button
          onClick={onNewCalculation}
          className="px-6 py-4 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-all"
        >
          🔄 Новый расчёт
        </button>
      </div>

      {/* Contact Form */}
      {showContactForm && (
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50 space-y-4">
          <h3 className="font-bold text-lg">Оставьте заявку</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ваше имя"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <input
              type="tel"
              placeholder="Телефон"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <input
            type="text"
            placeholder="Telegram / WhatsApp"
            value={contactForm.telegram}
            onChange={(e) => setContactForm({ ...contactForm, telegram: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          <textarea
            placeholder="Комментарий к заказу..."
            value={contactForm.comment}
            onChange={(e) => setContactForm({ ...contactForm, comment: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
          />
          <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all">
            ✅ Отправить заявку
          </button>
        </div>
      )}
    </div>
  );
}

function CostRow({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-lg font-bold text-white' : 'text-sm text-slate-300'}`}>
      <span>{label}</span>
      <span>{formatPrice(value)}</span>
    </div>
  );
}
