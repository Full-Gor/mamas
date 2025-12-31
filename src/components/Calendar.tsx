import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import { getCalendarDays, getMonthName, formatDate, isToday } from '../utils/dateUtils';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

interface CalendarProps {
  events: Event[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEK_DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

export function Calendar({ events, selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [navPressed, setNavPressed] = useState<'prev' | 'next' | null>(null);

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

  const selectMonth = (monthIndex: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const selectYear = (year: number) => {
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
    setShowYearPicker(false);
  };

  return (
    <NeuCard style={styles.container}>
      {/* Header avec navigation */}
      <View style={styles.header}>
        <View style={styles.navButtons}>
          {/* Bouton Précédent */}
          <TouchableOpacity
            style={[
              styles.navBtn,
              navPressed === 'prev' ? styles.navBtnPressed : styles.navBtnRaised,
            ]}
            onPressIn={() => setNavPressed('prev')}
            onPressOut={() => setNavPressed(null)}
            onPress={goToPrevMonth}
            activeOpacity={1}
          >
            <Feather name="chevron-left" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Bouton Suivant */}
          <TouchableOpacity
            style={[
              styles.navBtn,
              navPressed === 'next' ? styles.navBtnPressed : styles.navBtnRaised,
            ]}
            onPressIn={() => setNavPressed('next')}
            onPressOut={() => setNavPressed(null)}
            onPress={goToNextMonth}
            activeOpacity={1}
          >
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sélecteur de mois */}
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => {
            setShowMonthPicker(!showMonthPicker);
            setShowYearPicker(false);
          }}
        >
          <Text style={styles.selectorText}>{getMonthName(currentDate.getMonth())}</Text>
          <Feather name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>

        {/* Sélecteur d'année */}
        <TouchableOpacity
          style={styles.yearSelector}
          onPress={() => {
            setShowYearPicker(!showYearPicker);
            setShowMonthPicker(false);
          }}
        >
          <Text style={styles.selectorText}>{currentDate.getFullYear()}</Text>
          <Feather name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Mois */}
      {showMonthPicker && (
        <View style={styles.pickerDropdown}>
          {MONTHS.map((month, idx) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.pickerItem,
                currentDate.getMonth() === idx && styles.pickerItemActive,
              ]}
              onPress={() => selectMonth(idx)}
            >
              <Text style={[
                styles.pickerItemText,
                currentDate.getMonth() === idx && styles.pickerItemTextActive,
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Dropdown Année */}
      {showYearPicker && (
        <View style={styles.pickerDropdown}>
          {YEARS.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.pickerItem,
                currentDate.getFullYear() === year && styles.pickerItemActive,
              ]}
              onPress={() => selectYear(year)}
            >
              <Text style={[
                styles.pickerItemText,
                currentDate.getFullYear() === year && styles.pickerItemTextActive,
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* En-tête des jours de la semaine */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((day, idx) => (
          <View key={idx} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grille des jours */}
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
              ]}
              onPress={() => onSelectDate(dateStr)}
              activeOpacity={0.7}
            >
              {/* Cercle de sélection avec effet enfoncé */}
              <View style={[
                styles.dayInner,
                isSelected && styles.dayInnerSelected,
              ]}>
                <Text style={[
                  styles.dayText,
                  !dayData.isCurrentMonth && styles.dayTextMuted,
                  isTodayDate && !isSelected && styles.dayTextToday,
                  isSelected && styles.dayTextSelected,
                ]}>
                  {dayData.day}
                </Text>

                {/* Points d'événements */}
                {dayEvents.length > 0 && (
                  <View style={styles.dotsContainer}>
                    {dayEvents.slice(0, 3).map((event, i) => {
                      const category = getCategoryById(event.categoryId);
                      return (
                        <View
                          key={i}
                          style={[styles.dot, { backgroundColor: category?.color || colors.yellow }]}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
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
    gap: 10,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnRaised: {
    backgroundColor: colors.cardBgLight,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  navBtnPressed: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...neuStyles.selectorRaised,
    ...neuShadow.raisedSm,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...neuStyles.selectorRaised,
    ...neuShadow.raisedSm,
  },
  selectorText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  pickerDropdown: {
    position: 'absolute',
    top: 70,
    left: 100,
    right: 20,
    backgroundColor: colors.cardBgLight,
    borderRadius: 16,
    padding: 8,
    zIndex: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...neuShadow.raised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: '30%',
  },
  pickerItemActive: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  pickerItemText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  pickerItemTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
    padding: 2,
  },
  dayCellMuted: {
    opacity: 0.35,
  },
  dayInner: {
    width: '85%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayInnerSelected: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.dateSelected,
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
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    position: 'absolute',
    bottom: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
