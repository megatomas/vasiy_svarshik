import { AdminSettings, CalculatorData } from '../types';

export const defaultSettings: AdminSettings = {
  pipes: [
    { id: '1', name: '15×15', width: 15, height: 15, wallThickness: 1.5, pricePerMeter: 85 },
    { id: '2', name: '20×20', width: 20, height: 20, wallThickness: 1.5, pricePerMeter: 120 },
    { id: '3', name: '25×25', width: 25, height: 25, wallThickness: 1.5, pricePerMeter: 145 },
    { id: '4', name: '30×30', width: 30, height: 30, wallThickness: 1.5, pricePerMeter: 175 },
    { id: '5', name: '40×20', width: 40, height: 20, wallThickness: 1.5, pricePerMeter: 180 },
    { id: '6', name: '40×40', width: 40, height: 40, wallThickness: 2.0, pricePerMeter: 280 },
    { id: '7', name: '50×25', width: 50, height: 25, wallThickness: 2.0, pricePerMeter: 240 },
    { id: '8', name: '50×50', width: 50, height: 50, wallThickness: 2.0, pricePerMeter: 350 },
    { id: '9', name: '60×40', width: 60, height: 40, wallThickness: 2.0, pricePerMeter: 360 },
    { id: '10', name: '60×60', width: 60, height: 60, wallThickness: 2.0, pricePerMeter: 450 },
    { id: '11', name: '80×40', width: 80, height: 40, wallThickness: 2.0, pricePerMeter: 480 },
    { id: '12', name: '80×80', width: 80, height: 80, wallThickness: 3.0, pricePerMeter: 650 },
    { id: '13', name: '100×50', width: 100, height: 50, wallThickness: 3.0, pricePerMeter: 720 },
    { id: '14', name: '100×100', width: 100, height: 100, wallThickness: 3.0, pricePerMeter: 950 },
  ],
  workRates: [
    { id: '1', name: 'Сварка', pricePerHour: 800, unit: 'час' },
    { id: '2', name: 'Зачистка', pricePerHour: 400, unit: 'час' },
    { id: '3', name: 'Сборка', pricePerHour: 600, unit: 'час' },
    { id: '4', name: 'Покраска', pricePerHour: 500, unit: 'час' },
  ],
  difficultyCoefficients: [
    { level: 'Простая', coefficient: 1.0 },
    { level: 'Средняя', coefficient: 1.2 },
    { level: 'Сложная', coefficient: 1.5 },
    { level: 'Очень сложная', coefficient: 2.0 },
  ],
  additionalWorks: [
    { id: '1', name: 'Сверление отверстий', price: 500, enabled: false },
    { id: '2', name: 'Нарезка резьбы', price: 800, enabled: false },
    { id: '3', name: 'Гибка', price: 1500, enabled: false },
    { id: '4', name: 'Токарные работы', price: 2000, enabled: false },
    { id: '5', name: 'Фрезеровка', price: 2500, enabled: false },
    { id: '6', name: 'Монтаж', price: 5000, enabled: false },
    { id: '7', name: 'Доставка', price: 3000, enabled: false },
    { id: '8', name: 'Демонтаж старого изделия', price: 4000, enabled: false },
  ],
  markupPercent: 35,
  priceRangePercent: 10,
  weldingRates: {
    'Простая': 500,
    'Средняя': 800,
    'Сложная': 1200,
  },
  grindingRates: {
    'Нет': 0,
    'Частичная': 2000,
    'Полная': 4000,
  },
  paintRates: {
    'Без покраски': 0,
    'Грунтовка': 3000,
    'Грунт + эмаль': 5000,
    'Порошковая окраска': 8000,
  },
  surfacePrepRates: {
    'Без обработки': 0,
    'Зачистка': 1000,
    'Обезжиривание': 1500,
    'Пескоструй': 4000,
  },
};

export const defaultCalculatorData: CalculatorData = {
  productType: 'Стол',
  customProduct: '',
  length: 1200,
  width: 600,
  height: 750,
  legs: 4,
  sections: 1,
  wings: 2,
  quantity: 1,
  selectedPipe: '6',
  wallThickness: 2.0,
  customWallThickness: 2.0,
  pipeMeters: 15,
  weldingType: 'MIG/MAG',
  weldingComplexity: 'Средняя',
  workHours: 6,
  grindingLevel: 'Частичная',
  paintType: 'Грунт + эмаль',
  paintColor: 'Чёрный',
  surfacePrep: 'Зачистка',
  additionalWorks: [],
  difficultyLevel: 'Средняя',
  consumablesCost: 1500,
};

export const productTypes = [
  'Стол', 'Стеллаж', 'Полка', 'Каркас', 'Ворота',
  'Калитка', 'Ограждение', 'Лавка', 'Мангал', 'Навес',
  'Кровать', 'Подставка', 'Тележка', 'Другое'
] as const;

export const wallThicknesses = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0];

export const getProductFields = (productType: string) => {
  switch (productType) {
    case 'Стол':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: true, showSections: false, showWings: false };
    case 'Стеллаж':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: true, showWings: false };
    case 'Полка':
      return { showLength: true, showWidth: true, showHeight: false, showLegs: false, showSections: true, showWings: false };
    case 'Каркас':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
    case 'Ворота':
      return { showLength: false, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: true };
    case 'Калитка':
      return { showLength: false, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
    case 'Ограждение':
      return { showLength: true, showWidth: false, showHeight: true, showLegs: false, showSections: true, showWings: false };
    case 'Лавка':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: true, showSections: false, showWings: false };
    case 'Мангал':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: true, showSections: false, showWings: false };
    case 'Навес':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
    case 'Кровать':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: true, showSections: false, showWings: false };
    case 'Подставка':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
    case 'Тележка':
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
    default:
      return { showLength: true, showWidth: true, showHeight: true, showLegs: false, showSections: false, showWings: false };
  }
};
