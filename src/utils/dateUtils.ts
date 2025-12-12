// Utilitaires pour la manipulation des dates

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAYS_SHORT_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Formater une date en YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Obtenir le nom du jour en français
export function getDayName(date: Date, short = false): string {
  return short ? DAYS_SHORT_FR[date.getDay()] : DAYS_FR[date.getDay()];
}

// Obtenir le nom du mois en français
export function getMonthName(date: Date): string {
  return MONTHS_FR[date.getMonth()];
}

// Formater une date pour l'affichage
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${getDayName(date)} ${date.getDate()} ${getMonthName(date)}`;
}

// Obtenir les jours de la semaine à partir d'une date
export function getWeekDays(date: Date): Date[] {
  const days: Date[] = [];
  const currentDay = date.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  for (let i = 0; i < 7; i++) {
    const day = new Date(date);
    day.setDate(date.getDate() + mondayOffset + i);
    days.push(day);
  }

  return days;
}

// Obtenir tous les jours d'un mois
export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Ajouter les jours du mois précédent pour commencer par lundi
  const startDayOfWeek = firstDay.getDay();
  const daysFromPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  for (let i = daysFromPrevMonth; i > 0; i--) {
    const day = new Date(year, month, 1 - i);
    days.push(day);
  }

  // Ajouter tous les jours du mois
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Ajouter les jours du mois suivant pour compléter la grille
  const remainingDays = 42 - days.length; // 6 semaines * 7 jours
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

// Vérifier si deux dates sont le même jour
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

// Vérifier si une date est aujourd'hui
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// Parser une date et heure depuis un texte vocal
export function parseDateTimeFromText(text: string): { date: string; time: string } | null {
  const lowerText = text.toLowerCase();
  const today = new Date();

  // Recherche de l'heure (format: 15h, 15h30, 15:30)
  const timeRegex = /(\d{1,2})[h:](\d{2})?/;
  const timeMatch = lowerText.match(timeRegex);
  let time = '09:00'; // Heure par défaut

  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = timeMatch[2] ? timeMatch[2] : '00';
    time = `${hours}:${minutes}`;
  }

  // Recherche du jour de la semaine
  const daysMapping: { [key: string]: number } = {
    'lundi': 1, 'mardi': 2, 'mercredi': 3, 'jeudi': 4,
    'vendredi': 5, 'samedi': 6, 'dimanche': 0
  };

  for (const [dayName, dayNum] of Object.entries(daysMapping)) {
    if (lowerText.includes(dayName)) {
      const currentDay = today.getDay();
      let daysToAdd = dayNum - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Prendre le prochain jour si déjà passé
      }
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      return { date: formatDate(targetDate), time };
    }
  }

  // Mots-clés spéciaux
  if (lowerText.includes("aujourd'hui") || lowerText.includes('aujourd hui')) {
    return { date: formatDate(today), time };
  }

  if (lowerText.includes('demain')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return { date: formatDate(tomorrow), time };
  }

  if (lowerText.includes('après-demain') || lowerText.includes('après demain')) {
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);
    return { date: formatDate(afterTomorrow), time };
  }

  // Date spécifique (format: le 15, le 15 janvier)
  const dateRegex = /le\s+(\d{1,2})(?:\s+(\w+))?/;
  const dateMatch = lowerText.match(dateRegex);

  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    let month = today.getMonth();
    let year = today.getFullYear();

    if (dateMatch[2]) {
      const monthsMapping: { [key: string]: number } = {
        'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
        'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7,
        'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
      };

      const monthName = dateMatch[2].toLowerCase();
      if (monthsMapping[monthName] !== undefined) {
        month = monthsMapping[monthName];
        if (month < today.getMonth()) {
          year++; // Si le mois est passé, prendre l'année prochaine
        }
      }
    }

    const targetDate = new Date(year, month, day);
    return { date: formatDate(targetDate), time };
  }

  // Si aucune date n'est trouvée, utiliser aujourd'hui
  return { date: formatDate(today), time };
}
