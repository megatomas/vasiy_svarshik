import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminSettings, CalculatorData, CalculationResult } from '../types';
import { defaultSettings, defaultCalculatorData } from '../data/defaults';

interface AppState {
  // Calculator
  calculatorData: CalculatorData;
  currentStep: number;
  setCalculatorData: (data: Partial<CalculatorData>) => void;
  setCurrentStep: (step: number) => void;
  resetCalculator: () => void;

  // Results
  calculations: CalculationResult[];
  addCalculation: (result: CalculationResult) => void;
  updateCalculationStatus: (id: string, status: 'new' | 'in_progress' | 'done') => void;

  // Admin
  settings: AdminSettings;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  isAdminAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      calculatorData: { ...defaultCalculatorData },
      currentStep: 0,
      setCalculatorData: (data) =>
        set((state) => ({ calculatorData: { ...state.calculatorData, ...data } })),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetCalculator: () => set({ calculatorData: { ...defaultCalculatorData }, currentStep: 0 }),

      calculations: [],
      addCalculation: (result) =>
        set((state) => ({ calculations: [result, ...state.calculations] })),
      updateCalculationStatus: (id, status) =>
        set((state) => ({
          calculations: state.calculations.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })),

      settings: { ...defaultSettings },
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      
      isAdminAuthenticated: false,
      login: (username, password) => {
        if (username === 'admin' && password === 'admin') {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'welding-calculator-storage',
    }
  )
);
