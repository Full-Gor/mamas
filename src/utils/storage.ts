import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Event, Todo } from '../types';

const EVENTS_KEY = 'sg_app_events';
const TODOS_KEY = 'sg_app_todos';

// Events
export async function saveEvents(events: Event[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Erreur sauvegarde events:', error);
  }
}

export async function loadEvents(): Promise<Event[]> {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur chargement events:', error);
    return [];
  }
}

// Todos
export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Erreur sauvegarde todos:', error);
  }
}

export async function loadTodos(): Promise<Todo[]> {
  try {
    const data = await AsyncStorage.getItem(TODOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur chargement todos:', error);
    return [];
  }
}

// Générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
