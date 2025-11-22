
export interface Habit {
  id: string;
  name: string;
  frequency: string;
  motivation?: string;
  notes?: string;
  progress: number; // 0-100
  goalId?: string; // Optional link to a parent goal
}

export interface Goal {
  id: string;
  habitId: string;      // The habit this goal challenges
  habitName: string;    // Snapshot of the name
  rankId: string;       // 'subdito', 'poro', etc.
  rankName: string;     // 'Súbdito', 'Lobo', etc.
  rankEmoji: string;
  targetDays: number;
  daysCompleted: number;
  progress: number;     // 0-100
  isCompleted: boolean;
  reward?: string;
}

export interface User {
  username: string;
  email: string;
  memberSince: string;
  avatarUrl: string;
}

export interface RankOption {
  id: string;
  name: string;
  days: number;
  imageEmoji: string; 
}

export type SectionType = 'inicio' | 'usuario' | 'habitos' | 'metas' | 'progresos' | 'ajustes' | 'perfil';
