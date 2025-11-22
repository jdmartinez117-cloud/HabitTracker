
import { RankOption, Habit, Goal, User } from './types';

export const DEFAULT_USER_CREDENTIALS = {
  username: 'juan',
  password: '123' // Simplified for demo
};

export const DEFAULT_USER_PROFILE: User = {
  username: 'Juan Martínez',
  email: 'juan.martinez@example.com',
  memberSince: 'Enero 2025',
  avatarUrl: 'https://picsum.photos/seed/juan/150/150'
};

export const GOAL_RANKS: RankOption[] = [
  { id: 'subdito', name: 'Súbdito', days: 5, imageEmoji: '😐' },
  { id: 'poro', name: 'Poro', days: 10, imageEmoji: '🐹' },
  { id: 'rocoso', name: 'Rocoso', days: 15, imageEmoji: '🪨' },
  { id: 'lobo', name: 'Lobo', days: 20, imageEmoji: '🐺' },
  { id: 'copa', name: 'Copa', days: 30, imageEmoji: '🏆' },
];

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Leer 20 minutos', frequency: 'Diario', progress: 80, motivation: 'Aprender más' },
  { id: '2', name: 'Hacer ejercicio', frequency: '3 veces por semana', progress: 60, motivation: 'Salud' },
  { id: '3', name: 'Beber agua', frequency: 'Diario', progress: 90, motivation: 'Hidratación' },
];

export const INITIAL_GOALS: Goal[] = [
  { 
    id: '1', 
    habitId: '1', 
    habitName: 'Leer 20 minutos', 
    rankId: 'rocoso', 
    rankName: 'Rocoso', 
    rankEmoji: '🪨',
    targetDays: 15, 
    daysCompleted: 10, 
    progress: 66, 
    isCompleted: false, 
    reward: 'Libro nuevo' 
  },
  { 
    id: '2', 
    habitId: '2', 
    habitName: 'Hacer ejercicio', 
    rankId: 'subdito', 
    rankName: 'Súbdito', 
    rankEmoji: '😐',
    targetDays: 5, 
    daysCompleted: 5, 
    progress: 100, 
    isCompleted: true, 
    reward: 'Cheat meal' 
  }
];
