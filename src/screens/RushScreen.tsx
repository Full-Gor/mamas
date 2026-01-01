import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, neuShadow, neuStyles } from '../theme/colors';
import { NeuCard } from '../components/NeuCard';
import { RushTimer } from '../components/RushTimer';
import { CreateRushModal } from '../components/CreateRushModal';
import {
  loadRushes,
  saveRushes,
  completeTask,
  skipTask,
  toggleRushPause,
  setActiveProject,
  updateTaskNotes,
  updateProjectNotes,
  getRushStats,
  formatTime,
  formatTimeVerbose,
  deleteRush,
  removeStepFromWorkflow,
  reorderRushes,
  moveWorkflowStep,
  resetWorkflow,
} from '../services/rushStorage';
import type { Rush, RushProject, RushStats } from '../types/rush';
import { RUSH_COLORS } from '../types/rush';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function RushScreen() {
  const { t } = useTranslation();
  const [rushes, setRushes] = useState<Rush[]>([]);
  const [activeRushId, setActiveRushId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState<{ projectId: string; taskIndex?: number } | null>(null);
  const [notesText, setNotesText] = useState('');
  const [blinkingRushId, setBlinkingRushId] = useState<string | null>(null);
  const [timerAlert, setTimerAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Blinking animation
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Blinking effect for next rush
  useEffect(() => {
    if (blinkingRushId) {
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      blink.start();
      Vibration.vibrate([0, 200, 100, 200]); // Double vibration
      return () => blink.stop();
    } else {
      blinkAnim.setValue(1);
    }
  }, [blinkingRushId]);

  // Timer alert blinking
  useEffect(() => {
    if (timerAlert) {
      const timeout = setTimeout(() => setTimerAlert(false), 5000);
      Vibration.vibrate([0, 500, 200, 500]);
      return () => clearTimeout(timeout);
    }
  }, [timerAlert]);

  // Load rushes on mount
  useEffect(() => {
    const load = async () => {
      const loaded = await loadRushes();
      setRushes(loaded);
      // Set first active rush as selected
      const active = loaded.find(r => r.status === 'active');
      if (active) {
        setActiveRushId(active.id);
      } else if (loaded.length > 0) {
        setActiveRushId(loaded[0].id);
      }
    };
    load();
  }, []);

  // Save rushes when changed
  const updateRushes = async (newRushes: Rush[]) => {
    setRushes(newRushes);
    await saveRushes(newRushes);
  };

  const activeRush = rushes.find(r => r.id === activeRushId);
  const activeProject = activeRush?.projects.find(p => p.id === activeRush.activeProjectId);

  // Check switch timer limits (per step)
  useEffect(() => {
    if (!activeRush || !activeProject || activeRush.status === 'paused') return;
    if (!activeRush.switchTimerLimit || !activeProject.currentSessionStart) return;

    const timeLimitSeconds = activeRush.switchTimerLimit * 60;
    const currentStepIndex = activeProject.currentStepIndex;
    const currentTaskTimeSpent = activeProject.tasks[currentStepIndex]?.timeSpent || 0;

    const checkTimer = () => {
      const elapsed = Math.floor(
        (Date.now() - new Date(activeProject.currentSessionStart!).getTime()) / 1000
      );
      // Only count time for current step, not total project time
      if (elapsed + currentTaskTimeSpent >= timeLimitSeconds && !timerAlert) {
        setTimerAlert(true);
      }
    };

    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [activeRush, activeProject, timerAlert]);

  // Handlers
  const handleCreateRush = async (rush: Rush) => {
    await updateRushes([...rushes, rush]);
    setActiveRushId(rush.id);
  };

  const handleDeleteRush = (rushId: string) => {
    Alert.alert(
      t('rush.deleteRush'),
      t('rush.deleteRushConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const newRushes = deleteRush(rushes, rushId);
            await updateRushes(newRushes);
            if (activeRushId === rushId) {
              setActiveRushId(newRushes[0]?.id || null);
            }
          },
        },
      ]
    );
  };

  const handleCompleteTask = async () => {
    if (!activeRush || !activeProject) return;
    const updated = completeTask(activeRush, activeProject.id);
    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);

    // Reset timer alert for new step
    setTimerAlert(false);

    // Find next incomplete Rush and trigger blinking
    const currentRushIndex = rushes.findIndex(r => r.id === activeRush.id);
    const nextRush = rushes.find((r, idx) => {
      if (idx <= currentRushIndex) return false;
      const project = r.projects[0];
      return project && project.currentStepIndex < r.workflow.length;
    }) || rushes.find((r, idx) => {
      if (idx >= currentRushIndex) return false;
      const project = r.projects[0];
      return project && project.currentStepIndex < r.workflow.length;
    });

    if (nextRush && nextRush.id !== activeRush.id) {
      setBlinkingRushId(nextRush.id);
      // Auto-stop blinking after 10 seconds
      setTimeout(() => setBlinkingRushId(null), 10000);
    }
  };

  const handleSkipTask = async () => {
    if (!activeRush || !activeProject) return;
    const updated = skipTask(activeRush, activeProject.id);
    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);
    // Reset timer alert for new step
    setTimerAlert(false);
  };

  const handleTogglePause = async () => {
    if (!activeRush) return;
    const updated = toggleRushPause(activeRush);
    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);
  };

  const handleSelectProject = async (projectId: string) => {
    if (!activeRush) return;
    const updated = setActiveProject(activeRush, projectId);
    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);
  };

  const handleSaveNotes = async () => {
    if (!activeRush || !editingNotes) return;

    let updated: Rush;
    if (editingNotes.taskIndex !== undefined) {
      updated = updateTaskNotes(activeRush, editingNotes.projectId, editingNotes.taskIndex, notesText);
    } else {
      updated = updateProjectNotes(activeRush, editingNotes.projectId, notesText);
    }

    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);
    setEditingNotes(null);
    setNotesText('');
  };

  // Reordering handlers
  const handleMoveRush = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= rushes.length) return;
    const newRushes = reorderRushes(rushes, fromIndex, toIndex);
    await updateRushes(newRushes);
  };

  const handleMoveStep = async (fromIndex: number, direction: 'up' | 'down') => {
    if (!activeRush) return;
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= activeRush.workflow.length) return;
    const updated = moveWorkflowStep(activeRush, fromIndex, toIndex);
    const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
    await updateRushes(newRushes);
  };

  const handleDeleteStep = async (stepIndex: number) => {
    if (!activeRush || activeRush.workflow.length <= 1) {
      Alert.alert(t('common.error'), t('rush.cannotDeleteLastStep'));
      return;
    }
    Alert.alert(
      t('rush.deleteStep'),
      t('rush.deleteStepConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const updated = removeStepFromWorkflow(activeRush, stepIndex);
            const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
            await updateRushes(newRushes);
          },
        },
      ]
    );
  };

  const handleResetWorkflow = async () => {
    if (!activeRush) return;
    Alert.alert(
      t('rush.resetWorkflow'),
      t('rush.resetWorkflowConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('rush.reset'),
          style: 'destructive',
          onPress: async () => {
            const updated = resetWorkflow(activeRush);
            const newRushes = rushes.map(r => r.id === updated.id ? updated : r);
            await updateRushes(newRushes);
          },
        },
      ]
    );
  };

  const stats = activeRush ? getRushStats(activeRush) : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="zap" size={24} color={colors.accent} />
          <Text style={styles.headerTitle}>Rush Mode</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.editModeBtn, editMode && styles.editModeBtnActive]}
            onPress={() => setEditMode(!editMode)}
          >
            <Feather name="edit-2" size={18} color={editMode ? colors.accent : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addRushBtn}
            onPress={() => setShowCreateModal(true)}
          >
            <Feather name="plus" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rush Tabs */}
      {rushes.length > 0 && (
        <View style={styles.tabsContainer}>
          <View style={styles.tabsContent}>
          {rushes.map((rush, rushIndex) => {
            const isActive = rush.id === activeRushId;
            const isBlinking = rush.id === blinkingRushId;
            const rushColor = rush.color ? RUSH_COLORS[rush.color] : colors.accent;

            const tabContent = (
              <View style={styles.rushTabWrapper}>
                {editMode && rushIndex > 0 && (
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => handleMoveRush(rushIndex, 'up')}
                  >
                    <Feather name="chevron-left" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.rushTab,
                    isActive && styles.rushTabActive,
                    isActive && { borderBottomColor: rushColor },
                    isBlinking && styles.rushTabBlinking,
                    isBlinking && { borderColor: rushColor },
                    editMode && styles.rushTabEdit,
                  ]}
                  onPress={() => {
                    if (!editMode) {
                      setActiveRushId(rush.id);
                      if (isBlinking) setBlinkingRushId(null);
                    }
                  }}
                  onLongPress={() => handleDeleteRush(rush.id)}
                >
                  <View style={[styles.tabDot, { backgroundColor: rushColor }]} />
                  <Text
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                    numberOfLines={1}
                  >
                    {rush.name}
                  </Text>
                  {!editMode && rush.status === 'paused' && (
                    <Feather name="pause-circle" size={12} color={colors.textMuted} />
                  )}
                  {!editMode && rush.status === 'completed' && (
                    <Feather name="check-circle" size={12} color={colors.accent} />
                  )}
                  {editMode && (
                    <TouchableOpacity
                      style={styles.deleteTabBtn}
                      onPress={() => handleDeleteRush(rush.id)}
                    >
                      <Feather name="x" size={14} color={colors.red || '#ef4444'} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                {editMode && rushIndex < rushes.length - 1 && (
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => handleMoveRush(rushIndex, 'down')}
                  >
                    <Feather name="chevron-right" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            );

            // Wrap blinking rush in Animated.View
            if (isBlinking && !editMode) {
              return (
                <Animated.View key={rush.id} style={{ opacity: blinkAnim }}>
                  {tabContent}
                </Animated.View>
              );
            }
            return <View key={rush.id}>{tabContent}</View>;
          })}
          </View>
        </View>
      )}

      {/* Blinking Alert - Next Rush Notification */}
      {blinkingRushId && (
        <Animated.View style={[styles.blinkingAlert, { opacity: blinkAnim }]}>
          <View style={styles.blinkingAlertContent}>
            <Feather name="arrow-right-circle" size={20} color={colors.accent} />
            <Text style={styles.blinkingAlertText}>
              {t('rush.switchToNext')}: {rushes.find(r => r.id === blinkingRushId)?.name}
            </Text>
          </View>
          <View style={styles.blinkingAlertButtons}>
            <TouchableOpacity
              style={styles.blinkingAlertBtn}
              onPress={() => {
                setActiveRushId(blinkingRushId);
                setBlinkingRushId(null);
              }}
            >
              <Text style={styles.blinkingAlertBtnText}>{t('rush.goToNext')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.blinkingAlertDismiss}
              onPress={() => setBlinkingRushId(null)}
            >
              <Feather name="x" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Timer Alert - Time Limit Exceeded */}
      {timerAlert && (
        <View style={styles.timerAlertBar}>
          <View style={styles.timerAlertContent}>
            <Feather name="alert-triangle" size={20} color={colors.orange} />
            <Text style={styles.timerAlertText}>{t('rush.switchTimerAlert')}</Text>
          </View>
          <View style={styles.timerAlertButtons}>
            <TouchableOpacity
              style={styles.timerAlertBtn}
              onPress={() => setTimerAlert(false)}
            >
              <Text style={styles.timerAlertBtnText}>{t('rush.continueAnyway')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timerAlertDismiss}
              onPress={() => setTimerAlert(false)}
            >
              <Feather name="x" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!activeRush ? (
          // Empty State
          <View style={styles.emptyState}>
            <Feather name="zap" size={64} color={colors.textDim} />
            <Text style={styles.emptyTitle}>{t('rush.noActiveRush')}</Text>
            <Text style={styles.emptySubtitle}>{t('rush.createRushHint')}</Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => setShowCreateModal(true)}
            >
              <Feather name="plus" size={20} color={colors.background} />
              <Text style={styles.createBtnText}>{t('rush.createRush')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Timer Card */}
            <Animated.View
              style={timerAlert ? {
                shadowColor: colors.orange,
                shadowOpacity: 0.8,
                shadowRadius: 10,
              } : undefined}
            >
              <NeuCard style={timerAlert ? { ...styles.timerCard, ...styles.timerCardAlert } : styles.timerCard}>
                <View style={styles.timerHeader}>
                  <Text style={styles.rushName}>{activeRush.name}</Text>
                  <View style={styles.timerHeaderRight}>
                    {timerAlert && (
                      <Feather name="alert-triangle" size={20} color={colors.orange} />
                    )}
                    <TouchableOpacity onPress={() => setShowStatsModal(true)}>
                      <Feather name="bar-chart-2" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                <RushTimer
                  startTime={activeProject?.currentSessionStart}
                  initialSeconds={activeProject?.totalTimeSpent || 0}
                  isPaused={activeRush.status === 'paused'}
                  onPause={handleTogglePause}
                  onResume={handleTogglePause}
                  size="large"
                  accentColor={timerAlert ? colors.orange : (activeRush.color ? RUSH_COLORS[activeRush.color] : colors.accent)}
                />

                {/* Total Rush Time */}
                <View style={styles.totalTimeRow}>
                  <Text style={styles.totalTimeLabel}>{t('rush.totalTime')}</Text>
                  <Text style={styles.totalTimeValue}>
                    {formatTimeVerbose(activeRush.totalTimeSpent)}
                  </Text>
                </View>

                {timerAlert && (
                  <TouchableOpacity
                    style={styles.dismissAlertBtn}
                    onPress={() => setTimerAlert(false)}
                  >
                    <Text style={styles.dismissAlertText}>OK</Text>
                  </TouchableOpacity>
                )}
              </NeuCard>
            </Animated.View>

            {/* Current Task */}
            {activeProject && (
              <>
                <Text style={styles.sectionTitle}>{t('rush.currentTask')}</Text>
                <NeuCard style={styles.taskCard}>
                  {activeProject.currentStepIndex < activeRush.workflow.length ? (
                    <>
                      <View style={styles.taskHeader}>
                        <View style={styles.stepBadge}>
                          <Text style={styles.stepBadgeText}>
                            {activeProject.currentStepIndex + 1}/{activeRush.workflow.length}
                          </Text>
                        </View>
                        <Text style={styles.taskTitle}>
                          {activeRush.workflow[activeProject.currentStepIndex].title}
                        </Text>
                      </View>

                      {activeRush.workflow[activeProject.currentStepIndex].timeLimit && (
                        <View style={styles.timeLimitRow}>
                          <Feather name="clock" size={14} color={colors.orange} />
                          <Text style={styles.timeLimitText}>
                            {t('rush.timeLimit')}: {activeRush.workflow[activeProject.currentStepIndex].timeLimit}m
                          </Text>
                        </View>
                      )}

                      {/* Task Notes */}
                      <TouchableOpacity
                        style={styles.notesRow}
                        onPress={() => {
                          setEditingNotes({
                            projectId: activeProject.id,
                            taskIndex: activeProject.currentStepIndex,
                          });
                          setNotesText(activeProject.tasks[activeProject.currentStepIndex]?.notes || '');
                        }}
                      >
                        <Feather name="edit-3" size={14} color={colors.textMuted} />
                        <Text style={styles.notesText}>
                          {activeProject.tasks[activeProject.currentStepIndex]?.notes || t('rush.addNotes')}
                        </Text>
                      </TouchableOpacity>

                      {/* Action Buttons */}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.skipBtn}
                          onPress={handleSkipTask}
                        >
                          <Feather name="skip-forward" size={18} color={colors.textMuted} />
                          <Text style={styles.skipBtnText}>{t('rush.skip')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.completeBtn,
                            { backgroundColor: activeRush.color ? RUSH_COLORS[activeRush.color] : colors.accent },
                          ]}
                          onPress={handleCompleteTask}
                        >
                          <Feather name="check" size={20} color={colors.background} />
                          <Text style={styles.completeBtnText}>{t('rush.complete')}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <View style={styles.projectCompleted}>
                      <Feather name="check-circle" size={48} color={colors.accent} />
                      <Text style={styles.completedText}>{t('rush.projectCompleted')}</Text>
                      <Text style={styles.completedTime}>
                        {formatTimeVerbose(activeProject.totalTimeSpent)}
                      </Text>
                    </View>
                  )}
                </NeuCard>
              </>
            )}

            {/* Workflow Steps */}
            <Text style={styles.sectionTitle}>{t('rush.workflow')}</Text>
            <View style={styles.workflowList}>
              {activeRush.workflow.map((step, index) => {
                const task = activeProject?.tasks[index];
                const isCompleted = task?.status === 'completed';
                const isSkipped = task?.status === 'skipped';
                const isCurrent = index === activeProject?.currentStepIndex;

                return (
                  <View key={step.id} style={styles.workflowStep}>
                    {editMode && (
                      <View style={styles.stepEditControls}>
                        <TouchableOpacity
                          style={[styles.stepMoveBtn, index === 0 && styles.stepMoveBtnDisabled]}
                          onPress={() => handleMoveStep(index, 'up')}
                          disabled={index === 0}
                        >
                          <Feather name="chevron-up" size={16} color={index === 0 ? colors.textDim : colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.stepMoveBtn, index === activeRush.workflow.length - 1 && styles.stepMoveBtnDisabled]}
                          onPress={() => handleMoveStep(index, 'down')}
                          disabled={index === activeRush.workflow.length - 1}
                        >
                          <Feather name="chevron-down" size={16} color={index === activeRush.workflow.length - 1 ? colors.textDim : colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={[
                        styles.stepIndicator,
                        isCompleted && styles.stepCompleted,
                        isSkipped && styles.stepSkipped,
                        isCurrent && styles.stepCurrent,
                        isCurrent && { borderColor: activeRush.color ? RUSH_COLORS[activeRush.color] : colors.accent },
                      ]}
                    >
                      {isCompleted ? (
                        <Feather name="check" size={12} color={colors.background} />
                      ) : isSkipped ? (
                        <Feather name="skip-forward" size={10} color={colors.textMuted} />
                      ) : (
                        <Text style={styles.stepIndexText}>{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text
                        style={[
                          styles.stepTitle,
                          (isCompleted || isSkipped) && styles.stepTitleDone,
                          isCurrent && styles.stepTitleCurrent,
                        ]}
                      >
                        {step.title}
                      </Text>
                      {!editMode && task?.timeSpent ? (
                        <Text style={styles.stepTime}>{formatTime(task.timeSpent)}</Text>
                      ) : !editMode && step.timeLimit ? (
                        <Text style={styles.stepTimeLimit}>{step.timeLimit}m</Text>
                      ) : null}
                    </View>
                    {editMode && (
                      <TouchableOpacity
                        style={styles.deleteStepBtn}
                        onPress={() => handleDeleteStep(index)}
                      >
                        <Feather name="trash-2" size={16} color={colors.red || '#ef4444'} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Reset Workflow Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetWorkflow}
            >
              <Feather name="refresh-cw" size={16} color={colors.textMuted} />
              <Text style={styles.resetBtnText}>{t('rush.resetWorkflow')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Notes Modal */}
      {editingNotes && (
        <View style={styles.notesModal}>
          <View style={styles.notesModalContent}>
            <View style={styles.notesModalHeader}>
              <Text style={styles.notesModalTitle}>{t('rush.editNotes')}</Text>
              <TouchableOpacity onPress={() => setEditingNotes(null)}>
                <Feather name="x" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.notesModalInput}
              value={notesText}
              onChangeText={setNotesText}
              placeholder={t('rush.notesPlaceholder')}
              placeholderTextColor={colors.textDim}
              multiline
              autoFocus
            />
            <TouchableOpacity style={styles.notesModalBtn} onPress={handleSaveNotes}>
              <Text style={styles.notesModalBtnText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Stats Modal */}
      {showStatsModal && stats && (
        <View style={styles.statsModal}>
          <View style={styles.statsModalContent}>
            <View style={styles.statsModalHeader}>
              <Text style={styles.statsModalTitle}>{t('rush.statistics')}</Text>
              <TouchableOpacity onPress={() => setShowStatsModal(false)}>
                <Feather name="x" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalProjects}</Text>
                <Text style={styles.statLabel}>{t('rush.totalProjects')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.completedProjects}</Text>
                <Text style={styles.statLabel}>{t('rush.completedProjects')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.completedTasks}/{stats.totalTasks}</Text>
                <Text style={styles.statLabel}>{t('rush.tasks')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTimeVerbose(Math.round(stats.averageTimePerTask))}</Text>
                <Text style={styles.statLabel}>{t('rush.avgTimePerTask')}</Text>
              </View>
            </View>
            {stats.fastestProject && (
              <View style={styles.statRow}>
                <Feather name="zap" size={16} color={colors.accent} />
                <Text style={styles.statRowText}>
                  {t('rush.fastest')}: {stats.fastestProject.name} ({formatTimeVerbose(stats.fastestProject.time)})
                </Text>
              </View>
            )}
            {stats.slowestProject && (
              <View style={styles.statRow}>
                <Feather name="clock" size={16} color={colors.orange} />
                <Text style={styles.statRowText}>
                  {t('rush.slowest')}: {stats.slowestProject.name} ({formatTimeVerbose(stats.slowestProject.time)})
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Create Rush Modal */}
      <CreateRushModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRush={handleCreateRush}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editModeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editModeBtnActive: {
    backgroundColor: colors.cardBgDark,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  addRushBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuShadow.raisedSm,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tabsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blinkingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  blinkingAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  blinkingAlertText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  blinkingAlertButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blinkingAlertBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  blinkingAlertBtnText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  blinkingAlertDismiss: {
    padding: 4,
  },
  timerAlertBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.orange,
  },
  timerAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  timerAlertText: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  timerAlertButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerAlertBtn: {
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerAlertBtnText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  timerAlertDismiss: {
    padding: 4,
  },
  rushTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  rushTabActive: {
    borderBottomWidth: 2,
  },
  rushTabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rushTabEdit: {
    backgroundColor: colors.cardBgDark,
    borderRadius: 8,
  },
  rushTabBlinking: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: colors.cardBgDark,
  },
  moveBtn: {
    padding: 4,
  },
  deleteTabBtn: {
    marginLeft: 6,
    padding: 2,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabText: {
    fontSize: 13,
    color: colors.textMuted,
    maxWidth: 100,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  timerCard: {
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 24,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  timerHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerCardAlert: {
    borderWidth: 2,
    borderColor: colors.orange,
  },
  dismissAlertBtn: {
    marginTop: 16,
    backgroundColor: colors.orange,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dismissAlertText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  rushName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  totalTimeLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  totalTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    marginTop: 8,
  },
  addProjectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addProjectInput: {
    flex: 1,
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
  },
  addProjectBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectsScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  projectCard: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    minWidth: 120,
    ...neuShadow.raisedSm,
  },
  projectCardActive: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  projectCardBlinking: {
    borderWidth: 2,
    borderColor: colors.orange,
    backgroundColor: colors.cardBg,
  },
  projectCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectCardEdit: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.textDim,
  },
  projectMoveBtn: {
    padding: 4,
  },
  deleteProjectBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1,
  },
  projectName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 8,
  },
  projectNameActive: {
    color: colors.text,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.cardBgDark,
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
  projectProgress: {
    fontSize: 11,
    color: colors.textDim,
  },
  notesIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  taskCard: {
    marginBottom: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stepBadge: {
    backgroundColor: colors.cardBgDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepBadgeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  taskTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  timeLimitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  timeLimitText: {
    fontSize: 12,
    color: colors.orange,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.cardBgDark,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.cardBgDark,
    paddingVertical: 14,
    borderRadius: 12,
  },
  skipBtnText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  completeBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  completeBtnText: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '600',
  },
  projectCompleted: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 12,
  },
  completedTime: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  workflowList: {
    gap: 12,
  },
  workflowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepEditControls: {
    flexDirection: 'column',
    marginRight: 4,
  },
  stepMoveBtn: {
    padding: 2,
  },
  stepMoveBtnDisabled: {
    opacity: 0.3,
  },
  deleteStepBtn: {
    padding: 8,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBgDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCompleted: {
    backgroundColor: colors.accent,
  },
  stepSkipped: {
    backgroundColor: colors.cardBgLight,
  },
  stepCurrent: {
    borderWidth: 2,
  },
  stepIndexText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  stepTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textDim,
  },
  stepTitleCurrent: {
    color: colors.text,
    fontWeight: '600',
  },
  stepTime: {
    fontSize: 12,
    color: colors.accent,
  },
  stepTimeLimit: {
    fontSize: 11,
    color: colors.textDim,
  },
  notesModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  notesModalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
  },
  notesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  notesModalInput: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  notesModalBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  notesModalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  statsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  statsModalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
  },
  statsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  statRowText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: colors.cardBgDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetBtnText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
