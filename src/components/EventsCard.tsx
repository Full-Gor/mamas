import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

interface EventsCardProps {
  events: Event[];
  onAddEvent: () => void;
  selectedDate: string;
}

type FilterType = 'week' | 'today' | 'month';

const FILTER_LABELS: Record<FilterType, string> = {
  week: 'This Week',
  today: 'Today',
  month: 'This Month',
};

export function EventsCard({ events, onAddEvent, selectedDate }: EventsCardProps) {
  const [filter, setFilter] = useState<FilterType>('week');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtrer les événements selon le filtre
  const filteredEvents = events.slice(0, 5);

  const handleFilterSelect = (newFilter: FilterType) => {
    setFilter(newFilter);
    setShowDropdown(false);
  };

  return (
    <NeuCard>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
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
        <Text style={styles.emptyText}>No events</Text>
      ) : (
        filteredEvents.map((event) => {
          const category = getCategoryById(event.categoryId);
          const eventColor = category?.color || colors.blue;

          return (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventItem,
                { borderLeftColor: eventColor },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.eventDot, { backgroundColor: eventColor }]} />
              <Text style={styles.eventText} numberOfLines={1}>
                {event.title}, {event.time}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAddEvent}>
        <Feather name="plus" size={14} color={colors.textMuted} />
        <Text style={styles.addBtnText}>Add New Event</Text>
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
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
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
