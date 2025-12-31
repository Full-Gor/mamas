// Palette de couleurs neumorphique sombre - NeuCalendar style
export const colors = {
  background: '#1a1a1f',
  cardBg: '#1e1e24',
  cardBgLight: '#232329',
  cardBgDark: '#16161a',
  text: '#ffffff',
  textMuted: '#8b8b95',
  textDim: '#4a4a52',
  accent: '#4ade80',
  accentDark: '#22c55e',
  purple: '#a855f7',
  orange: '#f97316',
  blue: '#3b82f6',
  red: '#ef4444',
  yellow: '#fcd34d',
  shadowDark: 'rgba(0, 0, 0, 0.7)',
  shadowLight: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.05)',
};

// Ombres neumorphiques avancées (effet 3D/profondeur)
export const neuShadow = {
  // Effet surélevé (boutons, cartes)
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  raisedSm: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  // Effet enfoncé (éléments pressés, sélectionnés)
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  // Effet inset (pour simuler une ombre intérieure)
  inset: {
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 0,
  },
};

// Styles neumorphiques inline pour effets 3D avancés
export const neuStyles = {
  // Bouton surélevé (effet 3D positif)
  buttonRaised: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
  // Élément enfoncé (effet 3D négatif / inset)
  buttonPressed: {
    backgroundColor: colors.cardBgDark,
    borderRadius: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.3)',
    borderLeftColor: 'rgba(0, 0, 0, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  // Sélecteur surélevé large (mois, année)
  selectorRaised: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 16,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
  },
  // Carte principale
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderLeftColor: 'rgba(255, 255, 255, 0.06)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  // Date sélectionnée (effet enfoncé avec cercle)
  dateSelected: {
    backgroundColor: colors.cardBgDark,
    borderRadius: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.4)',
    borderLeftColor: 'rgba(0, 0, 0, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  // Événement avec barre latérale
  eventBar: {
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingLeft: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
};
