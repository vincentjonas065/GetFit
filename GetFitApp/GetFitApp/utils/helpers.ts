import { CompletedWorkout } from '../data/types';

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) {
    return `${minutes}m ${secs}s`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function calculateCurrentStreak(
  completedWorkouts: CompletedWorkout[]
): number {
  if (completedWorkouts.length === 0) {
    return 0;
  }

  const sortedByDate = [...completedWorkouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();

  for (const workout of sortedByDate) {
    const workoutDate = new Date(workout.date);
    const dayDiff = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === streak) {
      streak++;
      currentDate = workoutDate;
    } else if (dayDiff > streak) {
      break;
    }
  }

  return streak;
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'long' });
}

export function getDayName(dayOfWeek: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayOfWeek];
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

export function getWorkoutDuration(completedWorkouts: CompletedWorkout[]): {
  total: number;
  average: number;
} {
  if (completedWorkouts.length === 0) {
    return { total: 0, average: 0 };
  }

  const totalSeconds = completedWorkouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );
  const averageSeconds = Math.floor(totalSeconds / completedWorkouts.length);

  return {
    total: totalSeconds,
    average: averageSeconds,
  };
}

export function getWorkoutsByGoal(
  completedWorkouts: CompletedWorkout[],
  goalId: string
): CompletedWorkout[] {
  // This would need to be implemented with workout plan data
  return completedWorkouts;
}

export function getLastWorkoutDate(workouts: CompletedWorkout[]): Date | null {
  if (workouts.length === 0) return null;
  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return new Date(sorted[0].date);
}

export function getWorkoutsThisWeek(workouts: CompletedWorkout[]): number {
  const weekStart = getWeekStart();
  return workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    return workoutDate >= weekStart;
  }).length;
}
