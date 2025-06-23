import { LeetCodeProblem } from '@/types';

const STORAGE_KEY = 'leetcode-tracker-data';

export interface AppData {
  problems: LeetCodeProblem[];
  settings: {
    defaultCategory: string;
  };
}

const defaultData: AppData = {
  problems: [],
  settings: {
    defaultCategory: 'todo',
  },
};

export const localStorageManager = {
  loadData(): AppData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultData, ...parsed };
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return defaultData;
  },

  saveData(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },

  addProblem(problem: LeetCodeProblem): void {
    const data = this.loadData();
    data.problems.push(problem);
    this.saveData(data);
  },

  updateProblem(id: string, updates: Partial<LeetCodeProblem>): void {
    const data = this.loadData();
    const index = data.problems.findIndex(p => p.id === id);
    if (index !== -1) {
      data.problems[index] = { ...data.problems[index], ...updates };
      this.saveData(data);
    }
  },

  deleteProblem(id: string): void {
    const data = this.loadData();
    data.problems = data.problems.filter(p => p.id !== id);
    this.saveData(data);
  },

  exportData(): string {
    return JSON.stringify(this.loadData(), null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      this.saveData({ ...defaultData, ...imported });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};
