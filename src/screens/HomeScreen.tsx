import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';
import { formatDate } from '../utils/dateUtils';
import { loadEvents, saveEvents, loadTodos, saveTodos } from '../utils/storage';
import {
  Header,
  TimeCard,
  EventsCard,
  TodoCard,
  Calendar,
  AddEventModal,
  AddTodoModal,
  VoiceInput,
  CategoryLegend,
  SocialBar,
} from '../components';
import type { Event, Todo } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_TABLET = SCREEN_WIDTH > 600;

export function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      const [loadedEvents, loadedTodos] = await Promise.all([
        loadEvents(),
        loadTodos(),
      ]);
      setEvents(loadedEvents);
      setTodos(loadedTodos);
    };
    loadData();
  }, []);

  // Événements du jour sélectionné
  const selectedDayEvents = useMemo(() => {
    let filtered = events.filter(e => e.date === selectedDate);
    // Filtrer par catégorie si une est sélectionnée
    if (selectedCategory) {
      filtered = filtered.filter(e => e.categoryId === selectedCategory);
    }
    return filtered;
  }, [events, selectedDate, selectedCategory]);

  // Ajouter un événement
  const handleAddEvent = async (event: Event) => {
    const newEvents = [...events, event];
    setEvents(newEvents);
    await saveEvents(newEvents);
  };

  // Ajouter une tâche
  const handleAddTodo = async (todo: Todo) => {
    const newTodos = [...todos, todo];
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  // Toggle une tâche
  const handleToggleTodo = async (todoId: string) => {
    const newTodos = todos.map(t =>
      t.id === todoId ? { ...t, checked: !t.checked } : t
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  // Toggle un événement (marqué comme effectué)
  const handleToggleEvent = async (eventId: string) => {
    const newEvents = events.map(e =>
      e.id === eventId ? { ...e, completed: !e.completed } : e
    );
    setEvents(newEvents);
    await saveEvents(newEvents);
  };

  // Sélectionner/désélectionner une catégorie
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header userName="Arkace.dev" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {IS_TABLET ? (
          // Layout tablette (2 colonnes)
          <View style={styles.tabletLayout}>
            <View style={styles.leftColumn}>
              <TimeCard />
              <EventsCard
                events={selectedDayEvents}
                onAddEvent={() => setShowAddEvent(true)}
                onToggleEvent={handleToggleEvent}
                selectedDate={selectedDate}
              />
              <TodoCard
                todos={todos}
                onToggleTodo={handleToggleTodo}
                onAddTodo={() => setShowAddTodo(true)}
              />
            </View>
            <View style={styles.rightColumn}>
              <Calendar
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              {/* Voice Input pour tablette */}
              <VoiceInput
                selectedDate={selectedDate}
                onAddEvent={handleAddEvent}
                eventsCount={selectedDayEvents.length}
              />
              {/* Légende des catégories */}
              <CategoryLegend
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
              {/* Boutons sociaux */}
              <SocialBar />
            </View>
          </View>
        ) : (
          // Layout mobile (1 colonne)
          <View style={styles.mobileLayout}>
            <TimeCard />

            {/* Voice Input - bouton micro principal */}
            <VoiceInput
              selectedDate={selectedDate}
              onAddEvent={handleAddEvent}
              eventsCount={selectedDayEvents.length}
            />

            <Calendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <EventsCard
              events={selectedDayEvents}
              onAddEvent={() => setShowAddEvent(true)}
              onToggleEvent={handleToggleEvent}
              selectedDate={selectedDate}
            />

            <TodoCard
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onAddTodo={() => setShowAddTodo(true)}
            />

            {/* Légende des catégories */}
            <CategoryLegend
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Boutons sociaux */}
            <SocialBar />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <AddEventModal
        visible={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAddEvent={handleAddEvent}
        selectedDate={selectedDate}
      />

      <AddTodoModal
        visible={showAddTodo}
        onClose={() => setShowAddTodo(false)}
        onAddTodo={handleAddTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tabletLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  leftColumn: {
    width: 280,
    gap: 20,
  },
  rightColumn: {
    flex: 1,
    gap: 20,
  },
  mobileLayout: {
    gap: 16,
  },
});
