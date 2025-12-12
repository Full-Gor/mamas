import { useMemo } from 'react';
import type { Event } from '../types';
import { getMonthDays, formatDate, isToday } from '../utils/dateUtils';
import { getCategoryById } from '../data/categories';

interface CalendarProps {
  currentDate: Date;
  selectedDate: string;
  events: Event[];
  onDateSelect: (date: string) => void;
}

const DAYS_HEADER = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function Calendar({ currentDate, selectedDate, events, onDateSelect }: CalendarProps) {
  const days = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Grouper les événements par date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
      const existing = map.get(event.date) || [];
      existing.push(event);
      map.set(event.date, existing);
    });
    return map;
  }, [events]);

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      {/* En-tête des jours */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_HEADER.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateStr = formatDate(date);
          const dayEvents = eventsByDate.get(dateStr) || [];
          const isSelected = dateStr === selectedDate;
          const isTodayDate = isToday(date);
          const isInCurrentMonth = isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dateStr)}
              className={`
                relative min-h-[80px] p-1 rounded-lg border-2 transition-all
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-50'}
                ${!isInCurrentMonth ? 'opacity-40' : ''}
              `}
            >
              {/* Numéro du jour */}
              <div
                className={`
                  text-sm font-medium mb-1
                  ${isTodayDate ? 'w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto' : ''}
                  ${!isTodayDate && isInCurrentMonth ? 'text-gray-800' : ''}
                  ${!isTodayDate && !isInCurrentMonth ? 'text-gray-400' : ''}
                `}
              >
                {date.getDate()}
              </div>

              {/* Indicateurs d'événements (max 3 visibles) */}
              <div className="flex flex-wrap gap-0.5 justify-center">
                {dayEvents.slice(0, 3).map((event, i) => {
                  const category = getCategoryById(event.categoryId);
                  return (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category?.color || '#ccc' }}
                      title={event.title}
                    />
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-xs text-gray-500">+{dayEvents.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
