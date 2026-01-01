import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Rush,
  RushProject,
  RushProjectTask,
  RushWorkflowStep,
  RushStats,
  SavedWorkflow,
  RushTaskStatus,
  RushColor,
} from '../types/rush';
import { DEFAULT_WORKFLOWS } from '../types/rush';

const RUSHES_KEY = 'sg_app_rushes';
const WORKFLOWS_KEY = 'sg_app_workflows';

// Générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==================== STORAGE ====================

export async function saveRushes(rushes: Rush[]): Promise<void> {
  try {
    await AsyncStorage.setItem(RUSHES_KEY, JSON.stringify(rushes));
  } catch (error) {
    console.error('Erreur sauvegarde rushes:', error);
  }
}

export async function loadRushes(): Promise<Rush[]> {
  try {
    const data = await AsyncStorage.getItem(RUSHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur chargement rushes:', error);
    return [];
  }
}

export async function saveWorkflows(workflows: SavedWorkflow[]): Promise<void> {
  try {
    await AsyncStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Erreur sauvegarde workflows:', error);
  }
}

export async function loadWorkflows(): Promise<SavedWorkflow[]> {
  try {
    const data = await AsyncStorage.getItem(WORKFLOWS_KEY);
    const saved = data ? JSON.parse(data) : [];
    // Merge with default workflows
    const defaultIds = DEFAULT_WORKFLOWS.map(w => w.id);
    const userWorkflows = saved.filter((w: SavedWorkflow) => !defaultIds.includes(w.id));
    return [...DEFAULT_WORKFLOWS, ...userWorkflows];
  } catch (error) {
    console.error('Erreur chargement workflows:', error);
    return DEFAULT_WORKFLOWS;
  }
}

// ==================== RUSH CREATION ====================

export function createRush(
  name: string,
  workflow: RushWorkflowStep[],
  projectNames: string[],
  color?: RushColor,
  switchTimerLimit?: number
): Rush {
  const now = new Date().toISOString();

  const projects: RushProject[] = projectNames.map(projectName => ({
    id: generateId(),
    name: projectName,
    currentStepIndex: 0,
    tasks: workflow.map(step => ({
      stepId: step.id,
      status: 'pending' as RushTaskStatus,
      timeSpent: 0,
    })),
    totalTimeSpent: 0,
    sessions: [],
    createdAt: now,
  }));

  return {
    id: generateId(),
    name,
    color,
    switchTimerLimit,
    workflow,
    projects,
    status: 'active',
    activeProjectId: projects[0]?.id,
    totalTimeSpent: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createWorkflowSteps(steps: { title: string; timeLimit?: number }[]): RushWorkflowStep[] {
  return steps.map((step, index) => ({
    id: generateId(),
    title: step.title,
    order: index,
    timeLimit: step.timeLimit,
  }));
}

// ==================== TASK MANAGEMENT ====================

export function completeTask(rush: Rush, projectId: string): Rush {
  const now = new Date().toISOString();
  const project = rush.projects.find(p => p.id === projectId);
  if (!project) return rush;

  const currentTask = project.tasks[project.currentStepIndex];
  if (!currentTask || currentTask.status === 'completed') return rush;

  // Calculate time spent on this task
  let timeSpent = currentTask.timeSpent;
  if (project.currentSessionStart) {
    timeSpent += Math.floor((Date.now() - new Date(project.currentSessionStart).getTime()) / 1000);
  }

  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId) return p;

    const updatedTasks = p.tasks.map((t, i) => {
      if (i !== p.currentStepIndex) return t;
      return {
        ...t,
        status: 'completed' as RushTaskStatus,
        completedAt: now,
        timeSpent,
      };
    });

    const isLastTask = p.currentStepIndex === rush.workflow.length - 1;
    const nextStepIndex = isLastTask ? p.currentStepIndex : p.currentStepIndex + 1;

    // Start next task if not last
    if (!isLastTask && updatedTasks[nextStepIndex]) {
      updatedTasks[nextStepIndex] = {
        ...updatedTasks[nextStepIndex],
        status: 'in_progress',
        startedAt: now,
      };
    }

    return {
      ...p,
      currentStepIndex: nextStepIndex,
      tasks: updatedTasks,
      totalTimeSpent: p.totalTimeSpent + timeSpent - currentTask.timeSpent,
      currentSessionStart: isLastTask ? undefined : now,
      waitingSince: undefined,
      isBlinking: false,
    };
  });

  // Check if all projects are completed
  const allCompleted = updatedProjects.every(p =>
    p.tasks.every(t => t.status === 'completed' || t.status === 'skipped')
  );

  return {
    ...rush,
    projects: updatedProjects,
    status: allCompleted ? 'completed' : rush.status,
    completedAt: allCompleted ? now : undefined,
    updatedAt: now,
  };
}

export function skipTask(rush: Rush, projectId: string): Rush {
  const now = new Date().toISOString();
  const project = rush.projects.find(p => p.id === projectId);
  if (!project) return rush;

  const currentTask = project.tasks[project.currentStepIndex];
  if (!currentTask || currentTask.status === 'completed' || currentTask.status === 'skipped') {
    return rush;
  }

  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId) return p;

    const updatedTasks = p.tasks.map((t, i) => {
      if (i !== p.currentStepIndex) return t;
      return {
        ...t,
        status: 'skipped' as RushTaskStatus,
        completedAt: now,
      };
    });

    const isLastTask = p.currentStepIndex === rush.workflow.length - 1;
    const nextStepIndex = isLastTask ? p.currentStepIndex : p.currentStepIndex + 1;

    if (!isLastTask && updatedTasks[nextStepIndex]) {
      updatedTasks[nextStepIndex] = {
        ...updatedTasks[nextStepIndex],
        status: 'in_progress',
        startedAt: now,
      };
    }

    return {
      ...p,
      currentStepIndex: nextStepIndex,
      tasks: updatedTasks,
      currentSessionStart: isLastTask ? undefined : now,
      waitingSince: undefined,
      isBlinking: false,
    };
  });

  return {
    ...rush,
    projects: updatedProjects,
    updatedAt: now,
  };
}

// ==================== SESSION MANAGEMENT ====================

export function startSession(rush: Rush, projectId: string): Rush {
  const now = new Date().toISOString();

  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId) return p;

    const currentTask = p.tasks[p.currentStepIndex];
    if (!currentTask) return p;

    const updatedTasks = p.tasks.map((t, i) => {
      if (i !== p.currentStepIndex) return t;
      return {
        ...t,
        status: t.status === 'pending' ? 'in_progress' as RushTaskStatus : t.status,
        startedAt: t.startedAt || now,
      };
    });

    return {
      ...p,
      tasks: updatedTasks,
      currentSessionStart: now,
    };
  });

  return {
    ...rush,
    projects: updatedProjects,
    activeProjectId: projectId,
    startedAt: rush.startedAt || now,
    status: 'active',
    updatedAt: now,
  };
}

export function pauseSession(rush: Rush, projectId: string): Rush {
  const now = new Date().toISOString();

  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId || !p.currentSessionStart) return p;

    const sessionDuration = Math.floor(
      (Date.now() - new Date(p.currentSessionStart).getTime()) / 1000
    );

    // Update task time spent
    const updatedTasks = p.tasks.map((t, i) => {
      if (i !== p.currentStepIndex) return t;
      return {
        ...t,
        timeSpent: t.timeSpent + sessionDuration,
      };
    });

    // Add session to history
    const newSession = {
      id: generateId(),
      startedAt: p.currentSessionStart,
      endedAt: now,
      duration: sessionDuration,
    };

    return {
      ...p,
      tasks: updatedTasks,
      totalTimeSpent: p.totalTimeSpent + sessionDuration,
      currentSessionStart: undefined,
      sessions: [...p.sessions, newSession],
      waitingSince: now,
    };
  });

  const newTotalTime = updatedProjects.reduce((sum, p) => sum + p.totalTimeSpent, 0);

  return {
    ...rush,
    projects: updatedProjects,
    totalTimeSpent: newTotalTime,
    updatedAt: now,
  };
}

export function toggleRushPause(rush: Rush): Rush {
  const now = new Date().toISOString();
  const isPaused = rush.status === 'paused';

  if (isPaused) {
    // Resume - start session on active project
    if (rush.activeProjectId) {
      return {
        ...startSession(rush, rush.activeProjectId),
        status: 'active',
        updatedAt: now,
      };
    }
    return { ...rush, status: 'active', updatedAt: now };
  }

  // Pause - pause session on active project
  let updatedRush = rush;
  if (rush.activeProjectId) {
    updatedRush = pauseSession(rush, rush.activeProjectId);
  }

  return { ...updatedRush, status: 'paused', updatedAt: now };
}

// ==================== NOTES ====================

export function updateTaskNotes(rush: Rush, projectId: string, taskIndex: number, notes: string): Rush {
  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId) return p;

    const updatedTasks = p.tasks.map((t, i) => {
      if (i !== taskIndex) return t;
      return { ...t, notes };
    });

    return { ...p, tasks: updatedTasks };
  });

  return {
    ...rush,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
}

export function updateProjectNotes(rush: Rush, projectId: string, notes: string): Rush {
  const updatedProjects = rush.projects.map(p => {
    if (p.id !== projectId) return p;
    return { ...p, notes };
  });

  return {
    ...rush,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
}

// ==================== PROJECT MANAGEMENT ====================

export function setActiveProject(rush: Rush, projectId: string): Rush {
  // Pause current active project
  let updatedRush = rush;
  if (rush.activeProjectId && rush.activeProjectId !== projectId) {
    updatedRush = pauseSession(rush, rush.activeProjectId);
  }

  // Start session on new project
  return startSession(updatedRush, projectId);
}

export function addProjectToRush(rush: Rush, projectName: string): Rush {
  const now = new Date().toISOString();

  const newProject: RushProject = {
    id: generateId(),
    name: projectName,
    currentStepIndex: 0,
    tasks: rush.workflow.map(step => ({
      stepId: step.id,
      status: 'pending' as RushTaskStatus,
      timeSpent: 0,
    })),
    totalTimeSpent: 0,
    sessions: [],
    createdAt: now,
  };

  return {
    ...rush,
    projects: [...rush.projects, newProject],
    updatedAt: now,
  };
}

export function removeProjectFromRush(rush: Rush, projectId: string): Rush {
  const updatedProjects = rush.projects.filter(p => p.id !== projectId);

  return {
    ...rush,
    projects: updatedProjects,
    activeProjectId: rush.activeProjectId === projectId
      ? updatedProjects[0]?.id
      : rush.activeProjectId,
    updatedAt: new Date().toISOString(),
  };
}

// ==================== STATISTICS ====================

export function getRushStats(rush: Rush): RushStats {
  const completedProjects = rush.projects.filter(p =>
    p.tasks.every(t => t.status === 'completed' || t.status === 'skipped')
  );

  const allTasks = rush.projects.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'completed');

  const totalTaskTime = completedTasks.reduce((sum, t) => sum + t.timeSpent, 0);
  const averageTimePerTask = completedTasks.length > 0
    ? totalTaskTime / completedTasks.length
    : 0;

  // Find fastest and slowest completed projects
  const projectsWithTime = completedProjects
    .filter(p => p.totalTimeSpent > 0)
    .map(p => ({ name: p.name, time: p.totalTimeSpent }));

  const fastestProject = projectsWithTime.length > 0
    ? projectsWithTime.reduce((min, p) => p.time < min.time ? p : min)
    : undefined;

  const slowestProject = projectsWithTime.length > 0
    ? projectsWithTime.reduce((max, p) => p.time > max.time ? p : max)
    : undefined;

  return {
    totalProjects: rush.projects.length,
    completedProjects: completedProjects.length,
    totalTasks: allTasks.length,
    completedTasks: completedTasks.length,
    averageTimePerTask,
    fastestProject,
    slowestProject,
  };
}

// ==================== TIME FORMATTING ====================

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeVerbose(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

// ==================== WORKFLOW MANAGEMENT ====================

export function addStepToWorkflow(rush: Rush, stepTitle: string, afterIndex?: number): Rush {
  const newStep: RushWorkflowStep = {
    id: generateId(),
    title: stepTitle,
    order: afterIndex !== undefined ? afterIndex + 1 : rush.workflow.length,
  };

  let updatedWorkflow: RushWorkflowStep[];
  if (afterIndex !== undefined) {
    updatedWorkflow = [
      ...rush.workflow.slice(0, afterIndex + 1),
      newStep,
      ...rush.workflow.slice(afterIndex + 1).map(s => ({ ...s, order: s.order + 1 })),
    ];
  } else {
    updatedWorkflow = [...rush.workflow, newStep];
  }

  // Add the new task to all projects
  const updatedProjects = rush.projects.map(p => {
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : p.tasks.length;
    const newTask: RushProjectTask = {
      stepId: newStep.id,
      status: 'pending',
      timeSpent: 0,
    };

    const updatedTasks = [
      ...p.tasks.slice(0, insertIndex),
      newTask,
      ...p.tasks.slice(insertIndex),
    ];

    // Adjust currentStepIndex if needed
    const newStepIndex = insertIndex <= p.currentStepIndex && p.currentStepIndex < p.tasks.length
      ? p.currentStepIndex + 1
      : p.currentStepIndex;

    return {
      ...p,
      tasks: updatedTasks,
      currentStepIndex: newStepIndex,
    };
  });

  return {
    ...rush,
    workflow: updatedWorkflow,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
}

export function removeStepFromWorkflow(rush: Rush, stepIndex: number): Rush {
  if (rush.workflow.length <= 1) return rush; // Keep at least one step

  const removedStepId = rush.workflow[stepIndex].id;
  const updatedWorkflow = rush.workflow
    .filter((_, i) => i !== stepIndex)
    .map((s, i) => ({ ...s, order: i }));

  const updatedProjects = rush.projects.map(p => {
    const updatedTasks = p.tasks.filter(t => t.stepId !== removedStepId);

    // Adjust currentStepIndex
    let newStepIndex = p.currentStepIndex;
    if (stepIndex < p.currentStepIndex) {
      newStepIndex = Math.max(0, p.currentStepIndex - 1);
    } else if (stepIndex === p.currentStepIndex) {
      newStepIndex = Math.min(p.currentStepIndex, updatedTasks.length - 1);
    }

    return {
      ...p,
      tasks: updatedTasks,
      currentStepIndex: newStepIndex,
    };
  });

  return {
    ...rush,
    workflow: updatedWorkflow,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
}

export function updateStepTitle(rush: Rush, stepIndex: number, title: string): Rush {
  const updatedWorkflow = rush.workflow.map((s, i) =>
    i === stepIndex ? { ...s, title } : s
  );

  return {
    ...rush,
    workflow: updatedWorkflow,
    updatedAt: new Date().toISOString(),
  };
}

// ==================== RUSH SETTINGS ====================

export function updateRushColor(rush: Rush, color: RushColor): Rush {
  return {
    ...rush,
    color,
    updatedAt: new Date().toISOString(),
  };
}

export function updateRushName(rush: Rush, name: string): Rush {
  return {
    ...rush,
    name,
    updatedAt: new Date().toISOString(),
  };
}

export function deleteRush(rushes: Rush[], rushId: string): Rush[] {
  return rushes.filter(r => r.id !== rushId);
}

// ==================== REORDERING ====================

export function reorderRushes(rushes: Rush[], fromIndex: number, toIndex: number): Rush[] {
  if (fromIndex === toIndex) return rushes;
  const result = [...rushes];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function reorderProjects(rush: Rush, fromIndex: number, toIndex: number): Rush {
  if (fromIndex === toIndex) return rush;
  const projects = [...rush.projects];
  const [removed] = projects.splice(fromIndex, 1);
  projects.splice(toIndex, 0, removed);
  return {
    ...rush,
    projects,
    updatedAt: new Date().toISOString(),
  };
}

export function moveWorkflowStep(rush: Rush, fromIndex: number, toIndex: number): Rush {
  if (fromIndex === toIndex) return rush;

  // Move workflow step
  const workflow = [...rush.workflow];
  const [removedStep] = workflow.splice(fromIndex, 1);
  workflow.splice(toIndex, 0, removedStep);
  // Update order property
  const updatedWorkflow = workflow.map((s, i) => ({ ...s, order: i }));

  // Move corresponding tasks in all projects
  const updatedProjects = rush.projects.map(p => {
    const tasks = [...p.tasks];
    const [removedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, removedTask);

    // Adjust currentStepIndex
    let newStepIndex = p.currentStepIndex;
    if (p.currentStepIndex === fromIndex) {
      newStepIndex = toIndex;
    } else if (fromIndex < p.currentStepIndex && toIndex >= p.currentStepIndex) {
      newStepIndex = p.currentStepIndex - 1;
    } else if (fromIndex > p.currentStepIndex && toIndex <= p.currentStepIndex) {
      newStepIndex = p.currentStepIndex + 1;
    }

    return { ...p, tasks, currentStepIndex: newStepIndex };
  });

  return {
    ...rush,
    workflow: updatedWorkflow,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
}

// ==================== WORKFLOW RESET ====================

export function resetWorkflow(rush: Rush): Rush {
  const now = new Date().toISOString();

  // Reset all tasks in all projects
  const updatedProjects = rush.projects.map(p => ({
    ...p,
    currentStepIndex: 0,
    tasks: rush.workflow.map(step => ({
      stepId: step.id,
      status: 'pending' as RushTaskStatus,
      timeSpent: 0,
    })),
    totalTimeSpent: 0,
    sessions: [],
    currentSessionStart: undefined,
    waitingSince: undefined,
    isBlinking: false,
  }));

  return {
    ...rush,
    projects: updatedProjects,
    status: 'active',
    totalTimeSpent: 0,
    completedAt: undefined,
    updatedAt: now,
  };
}
