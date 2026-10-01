export type Goal = 'lose-weight' | 'build-endurance' | 'gain-speed' | 'gain-strength';
export type Equipment = 'full-gym' | 'no-equipment' | 'barbell' | 'dumbbell' | 'speed';
export type Rank = 'rookie' | 'bronze' | 'silver' | 'gold' | 'elite';
export type Duration = '3-months' | '6-months' | '9-months' | '12-months';

export interface User {
  id: string;
  name: string;
  selectedGoal?: Goal;
  selectedEquipment?: Equipment;
  xp: number;
  rank: Rank;
  totalWorkoutsCompleted: number;
  currentStreak: number;
  lastWorkoutDate?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  equipment: Equipment[];
  description: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl: string; // Path to GIF
  reps?: number;
  time?: number; // in seconds
  goals: Goal[];
}

export interface ExerciseSet {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  restSeconds: number;
}

export interface WorkoutDay {
  dayOfWeek: number; // 0-6
  exercises: ExerciseSet[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: Goal;
  equipment: Equipment;
  duration: Duration; // 3, 6, 9, or 12 months
  weeks: WorkoutDay[][];
  description: string;
  createdAt: string;
}

export interface ActiveWorkout {
  id: string;
  planId: string;
  startTime: string;
  currentExerciseIndex: number;
  completedExercises: number;
  paused: boolean;
  pausedAt?: string;
}

export interface CompletedWorkout {
  id: string;
  planId: string;
  date: string;
  duration: number; // in seconds
  exercisesCompleted: number;
  xpEarned: number;
}

export interface RankThreshold {
  rank: Rank;
  minXp: number;
  maxXp: number;
}

export interface UserProgress {
  userId: string;
  selectedGoal?: Goal;
  selectedEquipment?: Equipment;
  currentWorkoutStreak: number;
  totalWorkouts: number;
  completedWorkouts: CompletedWorkout[];
  xpByGoal: Record<Goal, number>;
  createdAt: string;
  updatedAt: string;
}
