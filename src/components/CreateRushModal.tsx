import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { loadWorkflows, createWorkflowSteps, createRush, generateId } from '../services/rushStorage';
import type { Rush, RushColor, SavedWorkflow } from '../types/rush';
import { RUSH_COLORS, DEFAULT_WORKFLOWS } from '../types/rush';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface CreateRushModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateRush: (rush: Rush) => void;
}

export function CreateRushModal({ visible, onClose, onCreateRush }: CreateRushModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [projectNames, setProjectNames] = useState('');
  const [selectedColor, setSelectedColor] = useState<RushColor>('green');
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>(DEFAULT_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<SavedWorkflow | null>(null);
  const [customSteps, setCustomSteps] = useState<string[]>(['']);
  const [useCustomWorkflow, setUseCustomWorkflow] = useState(false);

  useEffect(() => {
    const load = async () => {
      const loaded = await loadWorkflows();
      setWorkflows(loaded);
      if (loaded.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(loaded[0]);
      }
    };
    if (visible) {
      load();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const projects = projectNames
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (projects.length === 0) {
      projects.push('Project 1');
    }

    let workflowSteps;
    if (useCustomWorkflow) {
      const validSteps = customSteps.filter(s => s.trim().length > 0);
      if (validSteps.length === 0) return;
      workflowSteps = createWorkflowSteps(validSteps.map(title => ({ title })));
    } else if (selectedWorkflow) {
      workflowSteps = createWorkflowSteps(selectedWorkflow.steps);
    } else {
      return;
    }

    const newRush = createRush(name.trim(), workflowSteps, projects, selectedColor);
    onCreateRush(newRush);

    // Reset form
    setName('');
    setProjectNames('');
    setSelectedColor('green');
    setCustomSteps(['']);
    setUseCustomWorkflow(false);
    onClose();
  };

  const addCustomStep = () => {
    setCustomSteps([...customSteps, '']);
  };

  const updateCustomStep = (index: number, value: string) => {
    const newSteps = [...customSteps];
    newSteps[index] = value;
    setCustomSteps(newSteps);
  };

  const removeCustomStep = (index: number) => {
    if (customSteps.length > 1) {
      setCustomSteps(customSteps.filter((_, i) => i !== index));
    }
  };

  const canSubmit = name.trim().length > 0 && (
    (useCustomWorkflow && customSteps.some(s => s.trim().length > 0)) ||
    (!useCustomWorkflow && selectedWorkflow)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('rush.createRush')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Rush Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('rush.rushName')}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('rush.rushNamePlaceholder')}
                placeholderTextColor={colors.textDim}
              />
            </View>

            {/* Color Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('rush.selectColor')}</Text>
              <View style={styles.colorGrid}>
                {(Object.keys(RUSH_COLORS) as RushColor[]).map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: RUSH_COLORS[color] },
                      selectedColor === color && styles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Feather name="check" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Workflow Selection Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, !useCustomWorkflow && styles.toggleBtnActive]}
                onPress={() => setUseCustomWorkflow(false)}
              >
                <Text style={[styles.toggleText, !useCustomWorkflow && styles.toggleTextActive]}>
                  {t('rush.useTemplate')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, useCustomWorkflow && styles.toggleBtnActive]}
                onPress={() => setUseCustomWorkflow(true)}
              >
                <Text style={[styles.toggleText, useCustomWorkflow && styles.toggleTextActive]}>
                  {t('rush.customWorkflow')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Workflow Template or Custom */}
            {useCustomWorkflow ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('rush.workflowSteps')}</Text>
                {customSteps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <TextInput
                      style={[styles.input, styles.stepInput]}
                      value={step}
                      onChangeText={(value) => updateCustomStep(index, value)}
                      placeholder={t('rush.stepPlaceholder')}
                      placeholderTextColor={colors.textDim}
                    />
                    {customSteps.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeStepBtn}
                        onPress={() => removeCustomStep(index)}
                      >
                        <Feather name="x" size={18} color={colors.red} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={styles.addStepBtn} onPress={addCustomStep}>
                  <Feather name="plus" size={16} color={colors.accent} />
                  <Text style={styles.addStepText}>{t('rush.addStep')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('rush.selectTemplate')}</Text>
                <View style={styles.templateGrid}>
                  {workflows.map((wf) => (
                    <TouchableOpacity
                      key={wf.id}
                      style={[
                        styles.templateOption,
                        selectedWorkflow?.id === wf.id && styles.templateSelected,
                      ]}
                      onPress={() => setSelectedWorkflow(wf)}
                    >
                      <Text style={styles.templateName}>{wf.name}</Text>
                      <Text style={styles.templateSteps}>
                        {wf.steps.length} {t('rush.steps')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedWorkflow && (
                  <View style={styles.workflowPreview}>
                    {selectedWorkflow.steps.map((step, i) => (
                      <View key={i} style={styles.previewStep}>
                        <View style={styles.previewDot} />
                        <Text style={styles.previewText}>{step.title}</Text>
                        {step.timeLimit && (
                          <Text style={styles.previewTime}>{step.timeLimit}m</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Project Names */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('rush.projectNames')}</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={projectNames}
                onChangeText={setProjectNames}
                placeholder={t('rush.projectNamesPlaceholder')}
                placeholderTextColor={colors.textDim}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.hint}>{t('rush.projectNamesHint')}</Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Feather name="zap" size={20} color={colors.background} />
            <Text style={styles.submitBtnText}>{t('rush.startRush')}</Text>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
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
    marginBottom: 20,
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
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 6,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.cardBgDark,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.background,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  templateOption: {
    backgroundColor: colors.cardBgLight,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateSelected: {
    borderColor: colors.accent,
  },
  templateName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  templateSteps: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  workflowPreview: {
    backgroundColor: colors.cardBgDark,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  previewStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  previewText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  previewTime: {
    fontSize: 11,
    color: colors.textDim,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    color: colors.textMuted,
    width: 20,
  },
  stepInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeStepBtn: {
    padding: 8,
  },
  addStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  addStepText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
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
