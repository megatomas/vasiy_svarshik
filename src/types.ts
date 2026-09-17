export type ProductType = 
  | 'Стол' | 'Стеллаж' | 'Полка' | 'Каркас' | 'Ворота' 
  | 'Калитка' | 'Ограждение' | 'Лавка' | 'Мангал' | 'Навес' 
  | 'Кровать' | 'Подставка' | 'Тележка' | 'Другое';

export type WeldingType = 'MIG/MAG' | 'MMA' | 'TIG';
export type WeldingComplexity = 'Простая' | 'Средняя' | 'Сложная';
export type GrindingLevel = 'Нет' | 'Частичная' | 'Полная';
export type PaintType = 'Без покраски' | 'Грунтовка' | 'Грунт + эмаль' | 'Порошковая окраска';
export type SurfacePrep = 'Без обработки' | 'Зачистка' | 'Обезжиривание' | 'Пескоструй';
export type DifficultyLevel = 'Простая' | 'Средняя' | 'Сложная' | 'Очень сложная';

export interface PipeProfile {
  id: string;
  name: string;
  width: number;
  height: number;
  wallThickness: number;
  pricePerMeter: number;
}

export interface WorkRate {
  id: string;
  name: string;
  pricePerHour: number;
  unit: string;
}

export interface DifficultyCoefficient {
  level: DifficultyLevel;
  coefficient: number;
}

export interface AdditionalWork {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

export interface CalculatorData {
  productType: ProductType;
  customProduct: string;
  length: number;
  width: number;
  height: number;
  legs: number;
  sections: number;
  wings: number;
  quantity: number;
  selectedPipe: string;
  wallThickness: number;
  customWallThickness: number;
  pipeMeters: number;
  weldingType: WeldingType;
  weldingComplexity: WeldingComplexity;
  workHours: number;
  grindingLevel: GrindingLevel;
  paintType: PaintType;
  paintColor: string;
  surfacePrep: SurfacePrep;
  additionalWorks: string[];
  difficultyLevel: DifficultyLevel;
  consumablesCost: number;
}

export interface CalculationResult {
  id: string;
  date: string;
  data: CalculatorData;
  materialsCost: number;
  workCost: number;
  consumablesCost: number;
  processingCost: number;
  additionalWorksCost: number;
  totalCost: number;
  difficultyCoefficient: number;
  adjustedCost: number;
  markup: number;
  clientPrice: number;
  priceRange: [number, number];
  status: 'new' | 'in_progress' | 'done';
}

export interface AdminSettings {
  pipes: PipeProfile[];
  workRates: WorkRate[];
  difficultyCoefficients: DifficultyCoefficient[];
  additionalWorks: AdditionalWork[];
  markupPercent: number;
  priceRangePercent: number;
  weldingRates: Record<WeldingComplexity, number>;
  grindingRates: Record<GrindingLevel, number>;
  paintRates: Record<PaintType, number>;
  surfacePrepRates: Record<SurfacePrep, number>;
}
