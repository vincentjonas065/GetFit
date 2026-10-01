import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, CompletedWorkout, UserProgress, Goal, Equipment } from '../data/types';

const STORAGE_KEYS = {
  USER: '@getfit_user',
  COMPLETED_WORKOUTS: '@getfit_completed_workouts',
  USER_PROGRESS: '@getfit_user_progress',
  ACTIVE_WORKOUT: '@getfit_active_workout',
  SELECTED_GOAL: '@getfit_selected_goal',
  SELECTED_EQUIPMENT: '@getfit_selected_equipment',
};

// User Management
export async function getUser(): Promise<User | null> {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function saveUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

export async function createUser(name: string): Promise<User> {
  const user: User = {
    id: `user_${Date.now()}`,
    name,
    xp: 0,
    rank: 'rookie',
    totalWorkoutsCompleted: 0,
    currentStreak: 0,
    createdAt: new Date().toISOString(),
  };
  await saveUser(user);
  return user;
}

// Completed Workouts
export async function getCompletedWorkouts(): Promise<CompletedWorkout[]> {
  try {
    const workouts = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Error getting completed workouts:', error);
    return [];
  }
}

export async function saveCompletedWorkout(
  workout: CompletedWorkout
): Promise<void> {
  try {
    const workouts = await getCompletedWorkouts();
    workouts.push(workout);
    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPLETED_WORKOUTS,
      JSON.stringify(workouts)
    );
  } catch (error) {
    console.error('Error saving completed workout:', error);
  }
}

// User Progress
export async function getUserProgress(): Promise<UserProgress | null> {
  try {
    const progress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

// Selected Goal
export async function getSelectedGoal(): Promise<Goal | null> {
  try {
    const goal = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_GOAL);
    return goal as Goal | null;
  } catch (error) {
    console.error('Error getting selected goal:', error);
    return null;
  }
}

export async function saveSelectedGoal(goal: Goal): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_GOAL, goal);
  } catch (error) {
    console.error('Error saving selected goal:', error);
  }
}

// Selected Equipment
export async function getSelectedEquipment(): Promise<Equipment | null> {
  try {
    const equipment = await AsyncStorage.getItem(
      STORAGE_KEYS.SELECTED_EQUIPMENT
    );
    return equipment as Equipment | null;
  } catch (error) {
    console.error('Error getting selected equipment:', error);
    return null;
  }
}

export async function saveSelectedEquipment(equipment: Equipment): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_EQUIPMENT, equipment);
  } catch (error) {
    console.error('Error saving selected equipment:', error);
  }
}

// Bulk operations
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

export async function getAllData(): Promise<{
  user: User | null;
  completedWorkouts: CompletedWorkout[];
  userProgress: UserProgress | null;
}> {
  const [user, completedWorkouts, userProgress] = await Promise.all([
    getUser(),
    getCompletedWorkouts(),
    getUserProgress(),
  ]);

  return {
    user,
    completedWorkouts,
    userProgress,
  };
}
