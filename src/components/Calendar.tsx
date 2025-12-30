import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow } from '../theme/colors';
import { NeuCard } from './NeuCard';
import { getCalendarDays, getMonthName, getDayName, formatDate, isToday } from '../utils/dateUtils';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_SIZE = (SCREEN_WIDTH - 80) / 7;

interface CalendarProps {
  events: Event[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEK_DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

export function Calendar({ events, selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    return getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
      const existing = map.get(event.date) || [];
      existing.push(event);
      map.set(event.date, existing);
    });
    return map;
  }, [events]);

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <NeuCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navBtn} onPress={goToPrevMonth}>
            <Feather name="chevron-left" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={goToNextMonth}>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.monthSelector}>
          <Text style={styles.selectorText}>{getMonthName(currentDate.getMonth())}</Text>
          <Feather name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.yearSelector}>
          <Text style={styles.selectorText}>{currentDate.getFullYear()}</Text>
          <Feather name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Week days header */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((day, idx) => (
          <View key={idx} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.daysGrid}>
        {days.map((dayData, idx) => {
          const dateStr = formatDate(dayData.date);
          const dayEvents = eventsByDate.get(dateStr) || [];
          const isSelected = dateStr === selectedDate;
          const isTodayDate = isToday(dayData.date);

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                !dayData.isCurrentMonth && styles.dayCellMuted,
                isSelected && styles.dayCellSelected,
              ]}
              onPress={() => onSelectDate(dateStr)}
            >
              <Text style={[
                styles.dayText,
                !dayData.isCurrentMonth && styles.dayTextMuted,
                isTodayDate && styles.dayTextToday,
                isSelected && styles.dayTextSelected,
              ]}>
                {dayData.day}
              </Text>

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <View style={styles.dotsContainer}>
                  {dayEvents.slice(0, 3).map((event, i) => {
                    const category = getCategoryById(event.categoryId);
                    return (
                      <View
                        key={i}
                        style={[styles.dot, { backgroundColor: category?.color || colors.blue }]}
                      />
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBgLight,
    ...neuShadow.raisedSm,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBgLight,
    ...neuShadow.raisedSm,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  dayCellMuted: {
    opacity: 0.4,
  },
  dayCellSelected: {
    backgroundColor: colors.cardBgLight,
    ...neuShadow.pressed,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  dayTextMuted: {
    color: colors.textDim,
  },
  dayTextToday: {
    color: colors.accent,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: colors.text,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
