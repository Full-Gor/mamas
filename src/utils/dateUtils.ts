const DAYS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getDayName(dayIndex: number): string {
  return DAYS_FR[dayIndex];
}

export function getMonthName(monthIndex: number): string {
  return MONTHS_FR[monthIndex];
}

export function getCalendarDays(year: number, month: number): { day: number; isCurrentMonth: boolean; date: Date }[] {
  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Jours du mois précédent
  let startDayOfWeek = firstDay.getDay(); // 0 = dimanche
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month - 1, day)
    });
  }

  // Jours du mois actuel
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Jours du mois suivant (compléter à 42 jours = 6 semaines)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  return days;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

// Parser une date et heure depuis un texte vocal
export function parseDateTimeFromText(text: string): { date: string; time: string } | null {
  const lowerText = text.toLowerCase();
  const today = new Date();

  // Recherche de l'heure (format: 15h, 15h30, 15:30)
  const timeRegex = /(\d{1,2})[h:](\d{2})?/;
  const timeMatch = lowerText.match(timeRegex);
  let time = '09:00';

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
      if (daysToAdd <= 0) daysToAdd += 7;
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
        if (month < today.getMonth()) year++;
      }
    }

    const targetDate = new Date(year, month, day);
    return { date: formatDate(targetDate), time };
  }

  // Si aucune date n'est trouvée, utiliser aujourd'hui
  return { date: formatDate(today), time };
}
