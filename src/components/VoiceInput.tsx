import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { colors, neuShadow } from '../theme/colors';
import { findCategoryByKeyword, defaultCategory } from '../data/categories';
import { parseDateTimeFromText } from '../utils/dateUtils';
import { generateId } from '../utils/storage';
import type { Event } from '../types';

interface VoiceInputProps {
  selectedDate: string;
  onAddEvent: (event: Event) => void;
  eventsCount: number;
}

const MAX_EVENTS_PER_DAY = 10;

export function VoiceInput({ selectedDate, onAddEvent, eventsCount }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Vérifier les permissions au montage
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
    setHasPermission(result.granted);
  };

  const requestPermissions = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    setHasPermission(result.granted);
    return result.granted;
  };

  // Événements de reconnaissance vocale
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setTranscript('');
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript || '';
    setTranscript(text);

    if (event.isFinal && text) {
      processVoiceInput(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
    Alert.alert('Erreur', "La reconnaissance vocale a échoué. Réessayez.");
  });

  const startListening = async () => {
    // Vérifier la limite
    if (eventsCount >= MAX_EVENTS_PER_DAY) {
      Alert.alert('Limite atteinte', 'Maximum 10 événements par jour.');
      return;
    }

    // Vérifier les permissions
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission requise',
          "L'accès au microphone est nécessaire pour la reconnaissance vocale."
        );
        return;
      }
    }

    try {
      await ExpoSpeechRecognitionModule.start({
        lang: 'fr-FR',
        interimResults: true,
        maxAlternatives: 1,
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      Alert.alert('Erreur', 'Impossible de démarrer la reconnaissance vocale.');
    }
  };

  const stopListening = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const processVoiceInput = (text: string) => {
    // Trouver la catégorie
    const category = findCategoryByKeyword(text) || defaultCategory;

    // Parser la date et l'heure
    const dateTime = parseDateTimeFromText(text);

    // Créer l'événement
    const newEvent: Event = {
      id: generateId(),
      title: extractTitle(text),
      categoryId: category.id,
      date: dateTime?.date || selectedDate,
      time: dateTime?.time || '09:00',
      createdAt: new Date().toISOString(),
    };

    setPendingEvent(newEvent);
    setShowConfirm(true);
  };

  const extractTitle = (text: string): string => {
    let title = text.trim();
    title = title
      .replace(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/gi, '')
      .replace(/\b(aujourd'hui|demain|après-demain)\b/gi, '')
      .replace(/\b(le\s+\d{1,2}(\s+\w+)?)\b/gi, '')
      .replace(/\b\d{1,2}[h:]\d{0,2}\b/gi, '')
      .replace(/\bà\b/gi, '')
      .trim();
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const handleConfirm = () => {
    if (pendingEvent) {
      onAddEvent(pendingEvent);
    }
    setShowConfirm(false);
    setPendingEvent(null);
    setTranscript('');
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingEvent(null);
    setTranscript('');
  };

  return (
    <View style={styles.container}>
      {/* Bouton micro principal */}
      <TouchableOpacity
        style={[
          styles.micButton,
          isListening && styles.micButtonActive,
          eventsCount >= MAX_EVENTS_PER_DAY && styles.micButtonDisabled,
        ]}
        onPress={isListening ? stopListening : startListening}
        disabled={eventsCount >= MAX_EVENTS_PER_DAY}
        activeOpacity={0.8}
      >
        {isListening ? (
          <View style={styles.recordingIndicator}>
            <ActivityIndicator size="small" color={colors.text} />
          </View>
        ) : (
          <Feather
            name="mic"
            size={28}
            color={eventsCount >= MAX_EVENTS_PER_DAY ? colors.textDim : colors.text}
          />
        )}
      </TouchableOpacity>

      {/* Texte d'aide */}
      <Text style={styles.helpText}>
        {isListening
          ? 'Parlez maintenant...'
          : eventsCount >= MAX_EVENTS_PER_DAY
          ? 'Limite atteinte (10/jour)'
          : 'Appuyez pour parler'}
      </Text>

      {/* Transcript en cours */}
      {isListening && transcript && (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Modal de confirmation */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer l'ajout</Text>

            {pendingEvent && (
              <View style={styles.eventPreview}>
                <Text style={styles.previewLabel}>Titre</Text>
                <Text style={styles.previewValue}>{pendingEvent.title}</Text>

                <Text style={styles.previewLabel}>Date</Text>
                <Text style={styles.previewValue}>{pendingEvent.date}</Text>

                <Text style={styles.previewLabel}>Heure</Text>
                <Text style={styles.previewValue}>{pendingEvent.time}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raised,
  },
  micButtonActive: {
    backgroundColor: colors.red,
  },
  micButtonDisabled: {
    backgroundColor: colors.textDim,
    opacity: 0.5,
  },
  recordingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  transcriptBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    maxWidth: '90%',
  },
  transcriptText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  eventPreview: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
});
