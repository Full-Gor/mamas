import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import { categories } from '../data/categories';

interface CategoryLegendProps {
  onSelectCategory?: (categoryId: string) => void;
  selectedCategory?: string | null;
}

export function CategoryLegend({ onSelectCategory, selectedCategory }: CategoryLegendProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Afficher seulement 8 catégories par défaut, toutes si expanded
  const displayedCategories = expanded ? categories : categories.slice(0, 8);

  return (
    <NeuCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('categories.title')}</Text>
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandBtnText}>{expanded ? t('categories.less') : t('categories.all')}</Text>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {displayedCategories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                isSelected && styles.categoryItemSelected,
              ]}
              onPress={() => onSelectCategory?.(category.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: category.color },
                  isSelected && styles.colorDotSelected,
                ]}
              />
              <Text
                style={[
                  styles.categoryName,
                  isSelected && styles.categoryNameSelected,
                ]}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!expanded && categories.length > 8 && (
        <Text style={styles.moreText}>
          +{categories.length - 8} {t('categories.more')}
        </Text>
      )}
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  expandBtnText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    minWidth: '45%',
    flex: 1,
    maxWidth: '48%',
  },
  categoryItemSelected: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorDotSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryName: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  categoryNameSelected: {
    color: colors.text,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 11,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 12,
  },
});
