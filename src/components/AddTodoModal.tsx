import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { generateId } from '../utils/storage';
import { formatDate } from '../utils/dateUtils';
import type { Todo } from '../types';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (todo: Todo) => void;
}

export function AddTodoModal({ visible, onClose, onAddTodo }: AddTodoModalProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: generateId(),
      text: text.trim(),
      checked: false,
      date: formatDate(new Date()),
    };

    onAddTodo(newTodo);
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('modal.addTodo')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modal.todoText')}</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="..."
              placeholderTextColor={colors.textDim}
              multiline
            />
          </View>

          {/* Bouton Ajouter */}
          <TouchableOpacity
            style={[styles.submitBtn, !text.trim() && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!text.trim()}
          >
            <Text style={styles.submitBtnText}>{t('modal.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
