import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

interface EventsCardProps {
  events: Event[];
  onAddEvent: () => void;
  onToggleEvent?: (id: string) => void;
  selectedDate: string;
}

type FilterType = 'week' | 'today' | 'month';

export function EventsCard({ events, onAddEvent, onToggleEvent, selectedDate }: EventsCardProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('week');
  const [showDropdown, setShowDropdown] = useState(false);

  const FILTER_LABELS: Record<FilterType, string> = {
    week: t('events.thisWeek'),
    today: t('events.today'),
    month: t('events.thisMonth'),
  };

  // Tous les événements (pas de limite)
  const filteredEvents = events;

  const handleFilterSelect = (newFilter: FilterType) => {
    setFilter(newFilter);
    setShowDropdown(false);
  };

  return (
    <NeuCard>
      <View style={styles.header}>
        <Text style={styles.title}>{t('events.title')}</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>{FILTER_LABELS[filter]}</Text>
          <Feather name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Dropdown menu */}
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {(Object.keys(FILTER_LABELS) as FilterType[]).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.dropdownItem,
                filter === key && styles.dropdownItemActive,
              ]}
              onPress={() => handleFilterSelect(key)}
            >
              <Text style={[
                styles.dropdownItemText,
                filter === key && styles.dropdownItemTextActive,
              ]}>
                {FILTER_LABELS[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filteredEvents.length === 0 ? (
        <Text style={styles.emptyText}>{t('events.noEvents')}</Text>
      ) : (
        <ScrollView
          style={styles.eventsScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filteredEvents.map((event) => {
            const category = getCategoryById(event.categoryId);
            const eventColor = category?.color || colors.blue;
            const isCompleted = event.completed === true;

            return (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventItem,
                  { borderLeftColor: eventColor },
                  isCompleted && styles.eventItemCompleted,
                ]}
                onPress={() => onToggleEvent?.(event.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.eventDot,
                  { backgroundColor: eventColor },
                  isCompleted && styles.eventDotCompleted,
                ]} />
                <Text style={[
                  styles.eventText,
                  isCompleted && styles.eventTextCompleted,
                ]} numberOfLines={1}>
                  {event.title}, {event.time}
                </Text>
                {isCompleted && (
                  <Feather name="check" size={14} color={colors.accent} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAddEvent}>
        <Feather name="plus" size={14} color={colors.textMuted} />
        <Text style={styles.addBtnText}>{t('events.addNew')}</Text>
      </TouchableOpacity>
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  dropdownText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 6,
    zIndex: 100,
    ...neuShadow.raised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  dropdownItemText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dropdownItemTextActive: {
    color: colors.accent,
    fontWeight: '500',
  },
  eventsScroll: {
    maxHeight: 250, // Environ 5 événements visibles
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 8,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  eventItemCompleted: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
    opacity: 0.7,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDotCompleted: {
    opacity: 0.5,
  },
  eventText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  eventTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    paddingVertical: 20,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
