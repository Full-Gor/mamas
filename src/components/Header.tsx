import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';

interface HeaderProps {
  onSettingsPress?: () => void;
  onNotificationPress?: () => void;
  userName?: string;
}

export function Header({ onSettingsPress, onNotificationPress, userName = 'User' }: HeaderProps) {
  const [btnPressed, setBtnPressed] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      setShowNotifications(!showNotifications);
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      Alert.alert('Settings', 'Settings screen coming soon!');
    }
  };

  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logo}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>NC</Text>
        </View>
        <Text style={styles.logoTitle}>NeuCalendar.co</Text>
      </View>

      {/* Right side */}
      <View style={styles.headerRight}>
        <Text style={styles.welcomeText}>Welcome, {userName}</Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Notification button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            btnPressed === 'notif' ? styles.iconBtnPressed : styles.iconBtnRaised,
          ]}
          onPressIn={() => setBtnPressed('notif')}
          onPressOut={() => setBtnPressed(null)}
          onPress={handleNotificationPress}
          activeOpacity={1}
        >
          <Feather name="bell" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Mail button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            btnPressed === 'mail' ? styles.iconBtnPressed : styles.iconBtnRaised,
          ]}
          onPressIn={() => setBtnPressed('mail')}
          onPressOut={() => setBtnPressed(null)}
          onPress={() => Alert.alert('Messages', 'Messages coming soon!')}
          activeOpacity={1}
        >
          <Feather name="mail" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Power/Logout button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            btnPressed === 'power' ? styles.iconBtnPressed : styles.iconBtnRaised,
          ]}
          onPressIn={() => setBtnPressed('power')}
          onPressOut={() => setBtnPressed(null)}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive' },
          ])}
          activeOpacity={1}
        >
          <Feather name="power" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Notifications dropdown */}
      {showNotifications && (
        <View style={styles.notificationsDropdown}>
          <Text style={styles.notifTitle}>Notifications</Text>
          <View style={styles.notifItem}>
            <View style={styles.notifDot} />
            <Text style={styles.notifText}>No new notifications</Text>
          </View>
        </View>
      )}
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
    backgroundColor: colors.cardBgLight,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnRaised: {
    backgroundColor: colors.cardBgLight,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  iconBtnPressed: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
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
  notificationsDropdown: {
    position: 'absolute',
    top: 95,
    right: 70,
    width: 220,
    backgroundColor: colors.cardBgLight,
    borderRadius: 16,
    padding: 16,
    zIndex: 100,
    ...neuShadow.raised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDim,
  },
  notifText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
