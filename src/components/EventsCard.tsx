import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow } from '../theme/colors';
import { NeuCard } from './NeuCard';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

interface EventsCardProps {
  events: Event[];
  onAddEvent: () => void;
  selectedDate: string;
}

export function EventsCard({ events, onAddEvent, selectedDate }: EventsCardProps) {
  // Filtrer les événements de la semaine
  const weekEvents = events.slice(0, 5);

  return (
    <NeuCard>
      <View style={styles.header}>
        <Text style={styles.title}>Événements</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Cette semaine</Text>
          <Feather name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {weekEvents.length === 0 ? (
        <Text style={styles.emptyText}>Aucun événement</Text>
      ) : (
        weekEvents.map((event) => {
          const category = getCategoryById(event.categoryId);
          return (
            <TouchableOpacity key={event.id} style={styles.eventItem}>
              <View style={[styles.eventDot, { backgroundColor: category?.color || colors.blue }]} />
              <Text style={styles.eventText} numberOfLines={1}>
                {event.title}, {event.time}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAddEvent}>
        <Feather name="plus" size={14} color={colors.textMuted} />
        <Text style={styles.addBtnText}>Ajouter un événement</Text>
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
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
    ...neuShadow.raisedSm,
  },
  dropdownText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventText: {
    fontSize: 12,
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
    paddingVertical: 10,
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
