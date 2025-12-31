import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { formatTime } from '../services/rushStorage';

interface RushTimerProps {
  startTime?: string; // ISO date string when session started
  initialSeconds?: number; // Accumulated time before current session
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
  accentColor?: string;
}

export function RushTimer({
  startTime,
  initialSeconds = 0,
  isPaused = false,
  onPause,
  onResume,
  size = 'medium',
  showControls = true,
  accentColor = colors.accent,
}: RushTimerProps) {
  const [elapsed, setElapsed] = useState(initialSeconds);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Update elapsed time every second
  useEffect(() => {
    if (isPaused || !startTime) {
      setElapsed(initialSeconds);
      return;
    }

    const updateElapsed = () => {
      const sessionTime = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      setElapsed(initialSeconds + sessionTime);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime, initialSeconds, isPaused]);

  // Pulse animation when running
  useEffect(() => {
    if (!isPaused && startTime) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPaused, startTime]);

  const fontSize = size === 'large' ? 48 : size === 'medium' ? 32 : 20;
  const isRunning = !isPaused && !!startTime;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timerBox,
          size === 'large' && styles.timerBoxLarge,
          size === 'small' && styles.timerBoxSmall,
          isRunning && { borderColor: accentColor },
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Text style={[styles.timerText, { fontSize, color: isRunning ? accentColor : colors.text }]}>
          {formatTime(elapsed)}
        </Text>
      </Animated.View>

      {showControls && (
        <View style={styles.controls}>
          {isPaused || !startTime ? (
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: accentColor }]}
              onPress={onResume}
            >
              <Feather name="play" size={20} color={colors.background} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.controlBtn, styles.pauseBtn]}
              onPress={onPause}
            >
              <Feather name="pause" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  timerBox: {
    backgroundColor: colors.cardBgDark,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.border,
    ...neuStyles.buttonPressed,
  },
  timerBoxLarge: {
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  timerBoxSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  timerText: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  pauseBtn: {
    backgroundColor: colors.cardBgLight,
  },
});
