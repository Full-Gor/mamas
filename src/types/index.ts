// Types pour l'application SG App

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

export interface Todo {
  id: string;
  text: string;
  checked: boolean;
  date: string;
}

export interface CalendarDay {
  day: number;
  prevMonth?: boolean;
  nextMonth?: boolean;
  highlight?: boolean;
  selected?: boolean;
  dot?: string;
  moon?: boolean;
}
