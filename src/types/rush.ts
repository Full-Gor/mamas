// Types pour la fonctionnalité Rush - Mode productivité intensive

export type RushTaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type RushColor = 'gray' | 'blue' | 'red' | 'orange' | 'violet' | 'green' | 'cyan' | 'pink' | 'yellow';
export type ClockTheme = 'digital' | 'analog' | 'minimal';

// Étape de workflow
export interface RushWorkflowStep {
  id: string;
  title: string;
  order: number;
  timeLimit?: number; // Limite de temps en minutes (optionnel)
}

// Tâche d'un projet Rush
export interface RushProjectTask {
  stepId: string;
  status: RushTaskStatus;
  startedAt?: string;
  completedAt?: string;
  timeSpent: number; // Temps passé en secondes
  notes?: string; // Notes pour cette tâche
}

// Session de travail sur un projet
export interface RushProjectSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  duration: number; // Durée en secondes
  notes?: string;
}

// Projet dans un Rush
export interface RushProject {
  id: string;
  name: string;
  repoUrl?: string;
  currentStepIndex: number;
  tasks: RushProjectTask[];
  totalTimeSpent: number; // Temps total en secondes
  currentSessionStart?: string; // Début de session actuelle
  sessions: RushProjectSession[]; // Historique des sessions
  waitingSince?: string; // Quand le projet a commencé à attendre
  isBlinking?: boolean; // Ce projet doit-il clignoter
  blinkingStopped?: boolean; // L'utilisateur a arrêté le clignotement
  notes?: string; // Notes pour ce projet
  createdAt: string;
}

// Rush principal
export interface Rush {
  id: string;
  name: string;
  color?: RushColor;
  clockTheme?: ClockTheme;
  workflow: RushWorkflowStep[];
  projects: RushProject[];
  status: 'active' | 'paused' | 'completed';
  activeProjectId?: string;
  startedAt?: string;
  completedAt?: string;
  totalTimeSpent: number;
  switchTimerLimit?: number; // Limite de temps en minutes avant alerte de switch
  isBlinking?: boolean;
  blinkingStopped?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Statistiques Rush
export interface RushStats {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  averageTimePerTask: number;
  fastestProject?: { name: string; time: number };
  slowestProject?: { name: string; time: number };
}

// Template de workflow sauvegardé
export interface SavedWorkflow {
  id: string;
  name: string;
  steps: Omit<RushWorkflowStep, 'id'>[];
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Workflows par défaut
export const DEFAULT_WORKFLOWS: SavedWorkflow[] = [
  {
    id: 'peinture-rapide',
    name: 'Peinture Rapide',
    steps: [
      { title: 'Choisir Couleur Principale', order: 0 },
      { title: 'Peindre Arrière-Plan Uni', order: 1 },
      { title: 'Dessiner Forme Avant-Plan', order: 2 },
      { title: 'Peindre Avant-Plan Simple', order: 3 },
      { title: 'Un Point Lumineux', order: 4 },
      { title: 'Regarder et Sourire', order: 5 },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'etude-30-min',
    name: 'Étude 30 min',
    steps: [
      { title: 'Choisir Sujet + 3 Couleurs', order: 0 },
      { title: 'Peindre Arrière-Plan Rapide', order: 1 },
      { title: 'Bloquer Formes Principales', order: 2 },
      { title: 'Ajouter Ombres Simples', order: 3 },
      { title: '2 Accents Forts', order: 4 },
      { title: 'Note Progrès', order: 5 },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'feature-simple',
    name: 'Feature Simple',
    steps: [
      { title: 'Analyse', order: 0 },
      { title: 'Implémentation', order: 1 },
      { title: 'Test', order: 2 },
      { title: 'Review', order: 3 },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-mobile',
    name: 'App Mobile',
    steps: [
      { title: 'Design UI', order: 0 },
      { title: 'Composants', order: 1 },
      { title: 'Logique', order: 2 },
      { title: 'Intégration API', order: 3 },
      { title: 'Tests', order: 4 },
      { title: 'Build & Deploy', order: 5 },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    steps: [
      { title: 'Reproduction', order: 0 },
      { title: 'Diagnostic', order: 1 },
      { title: 'Fix', order: 2 },
      { title: 'Test', order: 3 },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Couleurs Rush mappées aux valeurs hex
export const RUSH_COLORS: Record<RushColor, string> = {
  gray: '#6b7280',
  blue: '#3b82f6',
  red: '#ef4444',
  orange: '#f97316',
  violet: '#8b5cf6',
  green: '#22c55e',
  cyan: '#06b6d4',
  pink: '#ec4899',
  yellow: '#eab308',
};
