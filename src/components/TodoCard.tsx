import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from './NeuCard';
import type { Todo } from '../types';

interface TodoCardProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: () => void;
}

type FilterType = 'today' | 'week' | 'all';

const FILTER_LABELS: Record<FilterType, string> = {
  today: 'Today',
  week: 'This Week',
  all: 'All',
};

export function TodoCard({ todos, onToggleTodo, onAddTodo }: TodoCardProps) {
  const [filter, setFilter] = useState<FilterType>('today');
  const [showDropdown, setShowDropdown] = useState(false);

  const todayTodos = todos.slice(0, 5);

  const handleFilterSelect = (newFilter: FilterType) => {
    setFilter(newFilter);
    setShowDropdown(false);
  };

  return (
    <NeuCard>
      <View style={styles.header}>
        <Text style={styles.title}>ToDo List</Text>
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

      {todayTodos.length === 0 ? (
        <Text style={styles.emptyText}>No tasks</Text>
      ) : (
        todayTodos.map((todo) => (
          <TouchableOpacity
            key={todo.id}
            style={styles.todoItem}
            onPress={() => onToggleTodo(todo.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              todo.checked && styles.checkboxChecked,
            ]}>
              {todo.checked && (
                <Feather name="check" size={12} color={colors.background} />
              )}
            </View>
            <Text style={[
              styles.todoText,
              todo.checked && styles.todoTextChecked,
            ]}>
              {todo.text}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAddTodo}>
        <Feather name="plus" size={14} color={colors.textMuted} />
        <Text style={styles.addBtnText}>Add New Item</Text>
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
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  todoText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  todoTextChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
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
