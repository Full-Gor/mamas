import { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { Event } from '../types';
import { findCategoryByKeyword, defaultCategory } from '../data/categories';
import { parseDateTimeFromText } from '../utils/dateUtils';
import { generateId } from '../utils/storage';

interface VoiceInputProps {
  selectedDate: string;
  eventsCount: number;
  onAddEvent: (event: Event) => void;
}

const MAX_EVENTS_PER_DAY = 10;

export function VoiceInput({ selectedDate, eventsCount, onAddEvent }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Traiter le transcript quand l'écoute se termine
  useEffect(() => {
    if (!isListening && transcript && !showConfirmation) {
      processVoiceInput(transcript);
    }
  }, [isListening, transcript]);

  const processVoiceInput = (text: string) => {
    // Vérifier la limite
    if (eventsCount >= MAX_EVENTS_PER_DAY) {
      setMessage({
        text: 'Limite atteinte pour aujourd\'hui (10 fonctions maximum)',
        type: 'error'
      });
      resetTranscript();
      return;
    }

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
      createdAt: new Date().toISOString()
    };

    setPendingEvent(newEvent);
    setShowConfirmation(true);
  };

  // Extraire un titre propre du texte
  const extractTitle = (text: string): string => {
    // Nettoyer le texte
    let title = text.trim();

    // Retirer les indications de temps
    title = title
      .replace(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/gi, '')
      .replace(/\b(aujourd'hui|demain|après-demain)\b/gi, '')
      .replace(/\b(le\s+\d{1,2}(\s+\w+)?)\b/gi, '')
      .replace(/\b\d{1,2}[h:]\d{0,2}\b/gi, '')
      .replace(/\b(à|a)\b/gi, '')
      .trim();

    // Capitaliser la première lettre
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const handleConfirm = () => {
    if (pendingEvent) {
      onAddEvent(pendingEvent);
      setMessage({
        text: 'Votre rendez-vous est enregistré !',
        type: 'success'
      });
    }
    setShowConfirmation(false);
    setPendingEvent(null);
    resetTranscript();

    // Effacer le message après 3 secondes
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingEvent(null);
    resetTranscript();
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setMessage(null);
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <p className="text-yellow-700">
          La reconnaissance vocale n'est pas supportée par votre navigateur.
          <br />
          Essayez avec Chrome ou Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      {/* Message de feedback */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Erreur de reconnaissance */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Modal de confirmation */}
      {showConfirmation && pendingEvent && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">Confirmer l'ajout :</h3>
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <p><strong>Titre :</strong> {pendingEvent.title}</p>
            <p><strong>Date :</strong> {pendingEvent.date}</p>
            <p><strong>Heure :</strong> {pendingEvent.time}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirmer
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Transcript en cours */}
      {isListening && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg min-h-[60px]">
          <p className="text-sm text-gray-500 mb-1">En écoute...</p>
          <p className="text-gray-800 font-medium">
            {transcript || '...'}
          </p>
        </div>
      )}

      {/* Bouton microphone */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleMicClick}
          disabled={eventsCount >= MAX_EVENTS_PER_DAY}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all
            ${isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : eventsCount >= MAX_EVENTS_PER_DAY
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            }
          `}
          aria-label={isListening ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isListening ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
          </svg>
        </button>

        <p className="mt-3 text-sm text-gray-500 text-center">
          {isListening
            ? 'Parlez maintenant...'
            : eventsCount >= MAX_EVENTS_PER_DAY
              ? 'Limite quotidienne atteinte'
              : 'Appuyez pour parler'
          }
        </p>

        <p className="mt-2 text-xs text-gray-400 text-center max-w-xs">
          Ex: "Dentiste mardi 15h" ou "Réunion demain à 10h"
        </p>
      </div>
    </div>
  );
}
