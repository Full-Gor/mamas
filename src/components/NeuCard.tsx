import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, neuShadow, neuStyles } from '../theme/colors';

interface NeuCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pressed?: boolean;
}

export function NeuCard({ children, style, pressed = false }: NeuCardProps) {
  return (
    <View style={[styles.card, pressed && styles.cardPressed, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 20,
    ...neuStyles.card,
    ...neuShadow.raised,
  },
  cardPressed: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
    ...neuShadow.pressed,
  },
});
