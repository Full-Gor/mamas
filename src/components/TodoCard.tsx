import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, neuShadow } from '../theme/colors';
import { NeuCard } from './NeuCard';
import type { Todo } from '../types';

interface TodoCardProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: () => void;
}

export function TodoCard({ todos, onToggleTodo, onAddTodo }: TodoCardProps) {
  const todayTodos = todos.slice(0, 5);

  return (
    <NeuCard>
      <View style={styles.header}>
        <Text style={styles.title}>ToDo List</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Aujourd'hui</Text>
          <Feather name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {todayTodos.length === 0 ? (
        <Text style={styles.emptyText}>Aucune tâche</Text>
      ) : (
        todayTodos.map((todo) => (
          <TouchableOpacity
            key={todo.id}
            style={styles.todoItem}
            onPress={() => onToggleTodo(todo.id)}
          >
            <View style={[styles.checkbox, todo.checked && styles.checkboxChecked]}>
              {todo.checked && <Feather name="check" size={12} color={colors.background} />}
            </View>
            <Text style={[styles.todoText, todo.checked && styles.todoTextChecked]}>
              {todo.text}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAddTodo}>
        <Feather name="plus" size={14} color={colors.textMuted} />
        <Text style={styles.addBtnText}>Ajouter une tâche</Text>
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
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  todoText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  todoTextChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
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
