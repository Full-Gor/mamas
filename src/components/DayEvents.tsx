import type { Event } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';
import { getCategoryById } from '../data/categories';

interface DayEventsProps {
  date: string;
  events: Event[];
  onDeleteEvent: (eventId: string) => void;
}

const MAX_EVENTS_PER_DAY = 10;

export function DayEvents({ date, events, onDeleteEvent }: DayEventsProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));
  const remainingSlots = MAX_EVENTS_PER_DAY - events.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {formatDisplayDate(date)}
        </h2>
        <div className={`text-sm px-2 py-1 rounded-full ${
          remainingSlots > 3 ? 'bg-green-100 text-green-700' :
          remainingSlots > 0 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {remainingSlots > 0
            ? `${remainingSlots} place${remainingSlots > 1 ? 's' : ''} restante${remainingSlots > 1 ? 's' : ''}`
            : 'Limite atteinte'
          }
        </div>
      </div>

      {/* Liste des événements */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Aucun événement pour ce jour</p>
          <p className="text-sm mt-1">Utilisez le microphone pour en ajouter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedEvents.map(event => {
            const category = getCategoryById(event.categoryId);
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                {/* Indicateur de couleur */}
                <div
                  className="w-3 h-full min-h-[40px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: category?.color || '#ccc' }}
                />

                {/* Heure */}
                <div className="text-sm font-semibold text-gray-600 w-14">
                  {event.time}
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{event.title}</div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                    style={{
                      backgroundColor: `${category?.color}20`,
                      color: category?.color
                    }}
                  >
                    {category?.name || 'Rendez-vous'}
                  </div>
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                  aria-label="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
