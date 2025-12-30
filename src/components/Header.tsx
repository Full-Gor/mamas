import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow } from '../theme/colors';

interface HeaderProps {
  onSettingsPress?: () => void;
  onNotificationPress?: () => void;
}

export function Header({ onSettingsPress, onNotificationPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>SG</Text>
        </View>
        <Text style={styles.logoTitle}>SG App</Text>
      </View>

      <View style={styles.headerRight}>
        <Text style={styles.welcomeText}>Bienvenue</Text>

        <TouchableOpacity style={styles.iconBtn} onPress={onNotificationPress}>
          <Feather name="bell" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={onSettingsPress}>
          <Feather name="settings" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
});
