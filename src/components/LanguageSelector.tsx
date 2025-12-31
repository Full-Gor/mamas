import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow } from '../theme/colors';
import { languages, changeLanguage, getCurrentLanguage } from '../i18n';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(getCurrentLanguage());

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    changeLanguage(langCode);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Feather name="globe" size={22} color={colors.accent} />
            <Text style={styles.headerTitle}>{t('settings.language')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Languages List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {languages.map((lang) => {
              const isSelected = lang.code === selectedLang;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langItem, isSelected && styles.langItemSelected]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.cardBgLight,
  },
  langItemSelected: {
    backgroundColor: colors.cardBgDark,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  langFlag: {
    fontSize: 24,
  },
  langName: {
    flex: 1,
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '500',
  },
  langNameSelected: {
    color: colors.text,
    fontWeight: '600',
  },
});
