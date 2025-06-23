export interface LeetCodeProblem {
  id: string;
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  category: 'todo' | 'practice' | 'completed';
  dateAdded: string;
}

export interface ProblemStats {
  total: number;
  completed: number;
  practice: number;
  todo: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface CategoryConfig {
  key: string;
  name: string;
  color: string;
  bgColor: string;
}
