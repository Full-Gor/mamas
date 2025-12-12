// Types pour l'application MAMAS - Agenda Intelligent

export interface Category {
  id: string;
  name: string;
  color: string;
  keywords: string[];
}

export interface Event {
  id: string;
  title: string;
  categoryId: string;
  date: string; // Format YYYY-MM-DD
  time: string; // Format HH:MM
  createdAt: string;
}

export interface DayEvents {
  date: string;
  events: Event[];
}

export type ViewMode = 'week' | 'month';

export interface AppState {
  events: Event[];
  selectedDate: string;
  viewMode: ViewMode;
}
