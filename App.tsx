import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import i18n from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { RushScreen } from './src/screens/RushScreen';
import { LanguageSelector } from './src/components';
import { initNotifications, setBadgeCount } from './src/services/notifications';
import { colors, neuShadow } from './src/theme/colors';

type TabName = 'home' | 'rush';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Initialize notifications and set badge count
    const init = async () => {
      await initNotifications();
      // Set initial badge count (example: 3 notifications)
      await setBadgeCount(3);
    };
    init();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <View style={styles.container}>
        {/* Screen Content */}
        <View style={styles.screenContainer}>
          {activeTab === 'home' ? <HomeScreen /> : <RushScreen />}
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'home' && styles.tabActive]}
            onPress={() => setActiveTab('home')}
          >
            <Feather
              name="calendar"
              size={24}
              color={activeTab === 'home' ? colors.accent : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'home' && styles.tabTextActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Language Button */}
          <TouchableOpacity
            style={styles.langTab}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.langButton}>
              <Feather name="globe" size={20} color={colors.text} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'rush' && styles.tabActive]}
            onPress={() => setActiveTab('rush')}
          >
            <Feather
              name="zap"
              size={24}
              color={activeTab === 'rush' ? colors.accent : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'rush' && styles.tabTextActive,
              ]}
            >
              Rush
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selector Modal */}
        <LanguageSelector
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
      </View>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...neuShadow.raised,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  tabActive: {
    // Active tab styling is handled by icon/text colors
  },
  tabText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  langTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  langButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
});
