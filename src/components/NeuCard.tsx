import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, neuShadow } from '../theme/colors';

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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...neuShadow.raised,
  },
  cardPressed: {
    ...neuShadow.pressed,
  },
});
