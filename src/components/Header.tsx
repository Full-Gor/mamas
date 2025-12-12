import { getMonthName } from '../utils/dateUtils';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onHelpClick: () => void;
}

export function Header({ currentDate, onPrevMonth, onNextMonth, onToday, onHelpClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">MAMAS</h1>
        </div>

        {/* Navigation du mois */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Mois précédent"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="min-w-[180px] text-center">
            <span className="text-lg font-semibold text-gray-800">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </span>
          </div>

          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Mois suivant"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={onToday}
            className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Bouton Aide */}
        <button
          onClick={onHelpClick}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Aide</span>
        </button>
      </div>
    </header>
  );
}
