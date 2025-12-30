// Palette de couleurs neumorphique sombre
export const colors = {
  background: '#1a1a1f',
  cardBg: '#1e1e24',
  cardBgLight: '#232329',
  text: '#ffffff',
  textMuted: '#6b6b75',
  textDim: '#4a4a52',
  accent: '#4ade80',
  accentDark: '#22c55e',
  purple: '#a855f7',
  orange: '#f97316',
  blue: '#3b82f6',
  red: '#ef4444',
  yellow: '#fcd34d',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  shadowLight: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.05)',
};

// Ombres neumorphiques (pour StyleSheet)
export const neuShadow = {
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  raisedSm: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  },
};
