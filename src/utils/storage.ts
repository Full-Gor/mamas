import type { Event } from '../types';

const STORAGE_KEY = 'mamas_events';

// Sauvegarder les événements dans le localStorage
export function saveEvents(events: Event[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

// Charger les événements depuis le localStorage
export function loadEvents(): Event[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
  return [];
}

// Supprimer un événement
export function deleteEvent(eventId: string): Event[] {
  const events = loadEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  saveEvents(filteredEvents);
  return filteredEvents;
}

// Ajouter un événement
export function addEvent(event: Event): Event[] {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
  return events;
}

// Générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
