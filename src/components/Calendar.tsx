import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import { getCalendarDays, getMonthName, formatDate, isToday } from '../utils/dateUtils';
import type { Event } from '../types';
import { getCategoryById } from '../data/categories';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_SMALL_SCREEN = SCREEN_WIDTH < 380;

interface CalendarProps {
  events: Event[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEK_DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTHS_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
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

  // Nom du mois adapté à la taille de l'écran
  const monthName = IS_SMALL_SCREEN
    ? MONTHS[currentDate.getMonth()]
    : getMonthName(currentDate.getMonth());

  return (
    <NeuCard style={styles.container}>
      {/* Header avec navigation - responsive */}
      <View style={styles.header}>
        {/* Boutons de navigation */}
        <View style={styles.navButtons}>
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
            <Feather name="chevron-left" size={16} color={colors.textMuted} />
          </TouchableOpacity>

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
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sélecteurs mois et année */}
        <View style={styles.selectors}>
          {/* Sélecteur de mois */}
          <TouchableOpacity
            style={styles.monthSelector}
            onPress={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
          >
            <Text style={styles.selectorText} numberOfLines={1}>{monthName}</Text>
            <Feather name="chevron-down" size={12} color={colors.text} />
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
            <Feather name="chevron-down" size={12} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Mois */}
      {showMonthPicker && (
        <View style={styles.pickerDropdown}>
          {MONTHS_FULL.map((month, idx) => (
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
                {IS_SMALL_SCREEN ? MONTHS[idx] : month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Dropdown Année */}
      {showYearPicker && (
        <View style={[styles.pickerDropdown, styles.yearPickerDropdown]}>
          {YEARS.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.pickerItem,
                styles.yearPickerItem,
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
            <Text style={styles.weekDayText}>{IS_SMALL_SCREEN ? day.charAt(0) : day}</Text>
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
    padding: IS_SMALL_SCREEN ? 12 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },
  navBtn: {
    width: IS_SMALL_SCREEN ? 32 : 36,
    height: IS_SMALL_SCREEN ? 32 : 36,
    borderRadius: 10,
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
  selectors: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: IS_SMALL_SCREEN ? 8 : 10,
    paddingHorizontal: IS_SMALL_SCREEN ? 10 : 14,
    borderRadius: 10,
    ...neuStyles.selectorRaised,
    ...neuShadow.raisedSm,
    maxWidth: IS_SMALL_SCREEN ? 80 : 120,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: IS_SMALL_SCREEN ? 8 : 10,
    paddingHorizontal: IS_SMALL_SCREEN ? 10 : 14,
    borderRadius: 10,
    ...neuStyles.selectorRaised,
    ...neuShadow.raisedSm,
  },
  selectorText: {
    fontSize: IS_SMALL_SCREEN ? 12 : 14,
    fontWeight: '500',
    color: colors.text,
  },
  pickerDropdown: {
    position: 'absolute',
    top: IS_SMALL_SCREEN ? 55 : 65,
    left: 12,
    right: 12,
    backgroundColor: colors.cardBgLight,
    borderRadius: 14,
    padding: 8,
    zIndex: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...neuShadow.raised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearPickerDropdown: {
    justifyContent: 'center',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: IS_SMALL_SCREEN ? '30%' : '32%',
    flexGrow: 1,
  },
  yearPickerItem: {
    minWidth: IS_SMALL_SCREEN ? '18%' : '18%',
  },
  pickerItemActive: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  pickerItemText: {
    fontSize: IS_SMALL_SCREEN ? 11 : 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  pickerItemTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekDayText: {
    fontSize: IS_SMALL_SCREEN ? 10 : 11,
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
    padding: 1,
  },
  dayCellMuted: {
    opacity: 0.35,
  },
  dayInner: {
    width: '85%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  dayInnerSelected: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.dateSelected,
  },
  dayText: {
    fontSize: IS_SMALL_SCREEN ? 12 : 14,
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
    gap: 2,
    marginTop: 2,
    position: 'absolute',
    bottom: IS_SMALL_SCREEN ? 2 : 4,
  },
  dot: {
    width: IS_SMALL_SCREEN ? 4 : 5,
    height: IS_SMALL_SCREEN ? 4 : 5,
    borderRadius: 2.5,
  },
});
