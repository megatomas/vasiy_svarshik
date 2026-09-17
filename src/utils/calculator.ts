import { CalculatorData, CalculationResult, AdminSettings } from '../types';

export function calculatePrice(data: CalculatorData, settings: AdminSettings): Omit<CalculationResult, 'id' | 'date' | 'status'> {
  // 1. Стоимость материалов (труба)
  const selectedPipe = settings.pipes.find(p => p.id === data.selectedPipe);
  const pipePricePerMeter = selectedPipe ? selectedPipe.pricePerMeter : 280;
  const materialsCost = data.pipeMeters * pipePricePerMeter * data.quantity;

  // 2. Стоимость работы (сварка)
  const weldingRate = settings.weldingRates[data.weldingComplexity] || 800;
  const workCost = data.workHours * weldingRate * data.quantity;

  // 3. Расходники
  const consumablesCost = data.consumablesCost * data.quantity;

  // 4. Обработка
  const grindingCost = settings.grindingRates[data.grindingLevel] || 0;
  const paintCost = settings.paintRates[data.paintType] || 0;
  const prepCost = settings.surfacePrepRates[data.surfacePrep] || 0;
  const processingCost = (grindingCost + paintCost + prepCost) * data.quantity;

  // 5. Дополнительные работы
  let additionalWorksCost = 0;
  data.additionalWorks.forEach(workId => {
    const work = settings.additionalWorks.find(w => w.id === workId);
    if (work) additionalWorksCost += work.price;
  });
  additionalWorksCost *= data.quantity;

  // 6. Итого себестоимость
  const totalCost = materialsCost + workCost + consumablesCost + processingCost + additionalWorksCost;

  // 7. Коэффициент сложности
  const difficultyCoeff = settings.difficultyCoefficients.find(d => d.level === data.difficultyLevel);
  const difficultyCoefficient = difficultyCoeff ? difficultyCoeff.coefficient : 1.0;
  const adjustedCost = totalCost * difficultyCoefficient;

  // 8. Наценка
  const markup = settings.markupPercent / 100;
  const clientPrice = adjustedCost * (1 + markup);

  // 9. Диапазон цен
  const rangePercent = settings.priceRangePercent / 100;
  const priceRange: [number, number] = [
    Math.round(clientPrice * (1 - rangePercent)),
    Math.round(clientPrice * (1 + rangePercent)),
  ];

  return {
    data,
    materialsCost: Math.round(materialsCost),
    workCost: Math.round(workCost),
    consumablesCost: Math.round(consumablesCost),
    processingCost: Math.round(processingCost),
    additionalWorksCost: Math.round(additionalWorksCost),
    totalCost: Math.round(totalCost),
    difficultyCoefficient,
    adjustedCost: Math.round(adjustedCost),
    markup: settings.markupPercent,
    clientPrice: Math.round(clientPrice),
    priceRange,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export function generateId(): string {
  return '#' + Math.floor(10000 + Math.random() * 90000).toString();
}
