import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow, neuStyles } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_SMALL_SCREEN = SCREEN_WIDTH < 380;

interface HeaderProps {
  onSettingsPress?: () => void;
  onNotificationPress?: () => void;
  userName?: string;
  notificationCount?: number;
}

export function Header({
  onSettingsPress,
  onNotificationPress,
  userName = 'User',
  notificationCount = 3,
}: HeaderProps) {
  const { t } = useTranslation();
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
      Alert.alert(t('header.settings'), t('header.settingsSoon'));
    }
  };

  // Nom d'utilisateur court pour mobile
  const displayName = IS_SMALL_SCREEN ? userName.split('.')[0] : userName;

  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logo}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>SG</Text>
          {/* Badge notification sur l'icône app */}
          {notificationCount > 0 && (
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </View>
        {!IS_SMALL_SCREEN && (
          <Text style={styles.logoTitle}>{t('app.name')}</Text>
        )}
      </View>

      {/* Right side */}
      <View style={styles.headerRight}>
        <Text style={styles.welcomeText} numberOfLines={1}>
          {t('app.welcome')}, {displayName}
        </Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Notification button avec badge */}
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
          {notificationCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Mail button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            btnPressed === 'mail' ? styles.iconBtnPressed : styles.iconBtnRaised,
          ]}
          onPressIn={() => setBtnPressed('mail')}
          onPressOut={() => setBtnPressed(null)}
          onPress={() => Alert.alert(t('header.messages'), t('header.messagesSoon'))}
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
          onPress={() => Alert.alert(t('header.logout'), t('header.logoutConfirm'), [
            { text: t('header.cancel'), style: 'cancel' },
            { text: t('header.logout'), style: 'destructive' },
          ])}
          activeOpacity={1}
        >
          <Feather name="power" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Notifications dropdown */}
      {showNotifications && (
        <View style={styles.notificationsDropdown}>
          <Text style={styles.notifTitle}>{t('header.notifications')}</Text>
          {notificationCount > 0 ? (
            <>
              <TouchableOpacity style={styles.notifItem}>
                <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.notifText}>{t('header.newEvent')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifItem}>
                <View style={[styles.notifDot, { backgroundColor: colors.blue }]} />
                <Text style={styles.notifText}>{t('header.reminder')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifItem}>
                <View style={[styles.notifDot, { backgroundColor: colors.orange }]} />
                <Text style={styles.notifText}>{t('header.taskCompleted')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.notifItem}>
              <View style={styles.notifDot} />
              <Text style={styles.notifText}>{t('header.noNotifications')}</Text>
            </View>
          )}
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
    paddingHorizontal: IS_SMALL_SCREEN ? 12 : 20,
    paddingVertical: 12,
    paddingTop: 50,
    gap: 8,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
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
  logoBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  logoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: IS_SMALL_SCREEN ? 6 : 8,
    flexShrink: 1,
  },
  welcomeText: {
    fontSize: 11,
    color: colors.textMuted,
    maxWidth: IS_SMALL_SCREEN ? 70 : 100,
  },
  iconBtn: {
    width: IS_SMALL_SCREEN ? 32 : 36,
    height: IS_SMALL_SCREEN ? 32 : 36,
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
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: colors.background,
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  avatar: {
    width: IS_SMALL_SCREEN ? 32 : 36,
    height: IS_SMALL_SCREEN ? 32 : 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  avatarText: {
    fontSize: IS_SMALL_SCREEN ? 12 : 14,
    fontWeight: '600',
    color: colors.background,
  },
  notificationsDropdown: {
    position: 'absolute',
    top: 95,
    right: 12,
    left: IS_SMALL_SCREEN ? 12 : undefined,
    width: IS_SMALL_SCREEN ? undefined : 240,
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
    flex: 1,
  },
});
