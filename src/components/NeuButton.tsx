import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native';
import { colors, neuShadow } from '../theme/colors';

interface NeuButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  small?: boolean;
  icon?: boolean;
}

export function NeuButton({ onPress, children, style, textStyle, small = false, icon = false }: NeuButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.button,
        small && styles.buttonSmall,
        icon && styles.buttonIcon,
        pressed && styles.buttonPressed,
        style,
      ]}
      activeOpacity={1}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonIcon: {
    width: 36,
    height: 36,
    padding: 0,
    borderRadius: 10,
  },
  buttonPressed: {
    ...neuShadow.pressed,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
