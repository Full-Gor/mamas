import { useState, useEffect, useMemo } from 'react';
import type { Event } from './types';
import { formatDate } from './utils/dateUtils';
import { loadEvents, saveEvents, deleteEvent as removeEvent } from './utils/storage';
import {
  Header,
  Calendar,
  DayEvents,
  VoiceInput,
  CategoryGrid,
  HelpModal
} from './components';

const MAX_EVENTS_PER_DAY = 10;

function App() {
  // États
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showHelp, setShowHelp] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  // Charger les événements au démarrage
  useEffect(() => {
    const savedEvents = loadEvents();
    setEvents(savedEvents);
  }, []);

  // Événements du jour sélectionné
  const selectedDayEvents = useMemo(() => {
    return events.filter(e => e.date === selectedDate);
  }, [events, selectedDate]);

  // Navigation du calendrier
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(formatDate(today));
  };

  // Gestion des événements
  const handleAddEvent = (event: Event) => {
    // Vérifier la limite
    const dayEvents = events.filter(e => e.date === event.date);
    if (dayEvents.length >= MAX_EVENTS_PER_DAY) {
      alert('Limite atteinte pour ce jour (10 fonctions maximum)');
      return;
    }

    const newEvents = [...events, event];
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    const newEvents = removeEvent(eventId);
    setEvents(newEvents);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onHelpClick={() => setShowHelp(true)}
      />

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendrier */}
          <div className="lg:col-span-2">
            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Panneau latéral */}
          <div className="space-y-4">
            {/* Événements du jour */}
            <DayEvents
              date={selectedDate}
              events={selectedDayEvents}
              onDeleteEvent={handleDeleteEvent}
            />

            {/* Entrée vocale */}
            <VoiceInput
              selectedDate={selectedDate}
              eventsCount={selectedDayEvents.length}
              onAddEvent={handleAddEvent}
            />
          </div>
        </div>

        {/* Bouton pour afficher/masquer les catégories */}
        <div className="text-center">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
          >
            {showCategories ? 'Masquer les catégories' : 'Voir les 40 catégories'}
            <svg
              className={`inline-block ml-1 w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Grille des catégories */}
        {showCategories && (
          <CategoryGrid />
        )}
      </main>

      {/* Modal d'aide */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}

export default App;
