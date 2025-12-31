import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow } from '../theme/colors';
import { categories } from '../data/categories';
import { generateId } from '../utils/storage';
import type { Event, Category } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
  selectedDate: string;
}

export function AddEventModal({ visible, onClose, onAddEvent, selectedDate }: AddEventModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newEvent: Event = {
      id: generateId(),
      title: title.trim(),
      categoryId: selectedCategory.id,
      date: selectedDate,
      time,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(newEvent);
    setTitle('');
    setTime('09:00');
    setSelectedCategory(categories[0]);
    onClose();
  };

  const isColorLight = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('modal.addEvent')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View style={styles.dateRow}>
            <Feather name="calendar" size={18} color={colors.accent} />
            <Text style={styles.dateText}>{selectedDate}</Text>
          </View>

          {/* Titre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modal.eventTitle')}</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="..."
              placeholderTextColor={colors.textDim}
            />
          </View>

          {/* Heure */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modal.selectTime')}</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor={colors.textDim}
            />
          </View>

          {/* Catégorie */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modal.selectCategory')}</Text>
            <TouchableOpacity
              style={[styles.categoryBtn, { borderColor: selectedCategory.color }]}
              onPress={() => setShowCategories(!showCategories)}
            >
              <View style={[styles.categoryDot, { backgroundColor: selectedCategory.color }]} />
              <Text style={styles.categoryBtnText}>{selectedCategory.name}</Text>
              <Feather name="chevron-down" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Liste des catégories */}
          {showCategories && (
            <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
              <View style={styles.categoriesGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      { backgroundColor: cat.color },
                      selectedCategory.id === cat.id && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setShowCategories(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryItemText,
                      { color: isColorLight(cat.color) ? '#333' : '#fff' }
                    ]} numberOfLines={1}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Bouton Ajouter */}
          <TouchableOpacity
            style={[styles.submitBtn, !title.trim() && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!title.trim()}
          >
            <Text style={styles.submitBtnText}>{t('modal.save')}</Text>
          </TouchableOpacity>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryBtnText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  categoriesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  categoryItemSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  categoryItemText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
