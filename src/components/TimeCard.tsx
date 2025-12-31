import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow } from '../theme/colors';
import { getMonthName, getDayName } from '../utils/dateUtils';

export function TimeCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const dayName = getDayName(date.getDay());
    const monthName = getMonthName(date.getMonth());
    return `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`;
  };

  // Soleil entre 6h et 18h, sinon lune
  const hour = currentTime.getHours();
  const isDaytime = hour >= 6 && hour < 18;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, isDaytime && styles.sunContainer]}>
        <Feather
          name={isDaytime ? "sun" : "moon"}
          size={24}
          color={isDaytime ? colors.orange : colors.yellow}
        />
      </View>
      <View>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...neuShadow.raised,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#252530',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunContainer: {
    backgroundColor: '#3d3520',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 2,
  },
});
