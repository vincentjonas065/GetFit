import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  getUser,
  getCompletedWorkouts,
} from '../utils/storage';
import {
  calculateCurrentStreak,
  formatTime,
  getWorkoutDuration,
  getWorkoutsThisWeek,
  getDateString,
} from '../utils/helpers';
import { CompletedWorkout, User } from '../data/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB81C',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFB81C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  workoutItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB81C',
  },
  workoutDate: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDetails: {
    flex: 1,
  },
  workoutExercises: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  workoutDuration: {
    fontSize: 12,
    color: '#aaa',
  },
  workoutXP: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB81C',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  chartBar: {
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  chartBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: '#FFB81C',
  },
});

export default function ProgressScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const userData = await getUser();
      const completedWorkouts = await getCompletedWorkouts();

      setUser(userData);
      setWorkouts(
        completedWorkouts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setStreak(calculateCurrentStreak(completedWorkouts));
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { total, average } = getWorkoutDuration(workouts);
  const workoutsThisWeek = getWorkoutsThisWeek(workouts);

  // Get workouts by last 7 days for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return getDateString(date);
  }).reverse();

  const workoutsByDay = last7Days.map((day) => {
    return workouts.filter((w) => w.date.startsWith(day)).length;
  });

  const maxWorkoutsInDay = Math.max(...workoutsByDay, 1);

  const renderWorkoutItem = ({ item }: { item: CompletedWorkout }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <View style={styles.workoutInfo}>
        <View style={styles.workoutDetails}>
          <Text style={styles.workoutExercises}>
            {item.exercisesCompleted} Exercises
          </Text>
          <Text style={styles.workoutDuration}>{formatTime(item.duration)}</Text>
        </View>
        <Text style={styles.workoutXP}>+{item.xpEarned} XP</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{workouts.length}</Text>
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{workoutsThisWeek}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatTime(average)}</Text>
                <Text style={styles.statLabel}>Avg Duration</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatTime(total)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </View>

        {workouts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Last 7 Days</Text>
              {last7Days.map((day, index) => (
                <View key={day} style={styles.chartBar}>
                  <Text style={styles.chartLabel}>
                    {new Date(day).toLocaleDateString('en-US', {
                      weekday: 'short',
                    })}
                  </Text>
                  <View style={styles.chartBarBackground}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          width: `${
                            (workoutsByDay[index] / maxWorkoutsInDay) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout History</Text>

          {workouts.length > 0 ? (
            <FlatList
              data={workouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No workouts yet. Start training to see your progress!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
