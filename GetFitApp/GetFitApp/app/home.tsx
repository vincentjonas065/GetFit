import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  getUser,
  getCompletedWorkouts,
  getSelectedGoal,
  getSelectedEquipment,
} from '../utils/storage';
import { calculateCurrentStreak, getWorkoutsThisWeek } from '../utils/helpers';
import { getRankByXp, RANK_COLORS, RANK_DESCRIPTIONS } from '../data/ranks';
import { User, CompletedWorkout } from '../data/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statGrid: {
    gap: 12,
  },
  statRow: {
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
    fontSize: 24,
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
  rankCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFB81C',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#FFB81C',
  },
  rankBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  rankInfo: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  rankSubtitle: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  xpBar: {
    backgroundColor: '#333',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#FFB81C',
  },
  xpLabel: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#FFB81C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonSecondary: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFB81C',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#FFB81C',
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 10,
  },
  quickLink: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFB81C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickLinkText: {
    color: '#FFB81C',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
});

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [streak, setStreak] = useState(0);
  const [goal, setGoal] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const userData = await getUser();
      const completedWorkouts = await getCompletedWorkouts();
      const selectedGoal = await getSelectedGoal();
      const selectedEquipment = await getSelectedEquipment();

      setUser(userData);
      setWorkouts(completedWorkouts);
      setStreak(calculateCurrentStreak(completedWorkouts));
      setGoal(selectedGoal || '');
      setEquipment(selectedEquipment || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.greeting}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rank = getRankByXp(user.xp);
  const rankColor = RANK_COLORS[rank];
  const rankDesc = RANK_DESCRIPTIONS[rank];
  const workoutsThisWeek = getWorkoutsThisWeek(workouts);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, {user.name}! 💪</Text>

          <View style={styles.rankCard}>
            <View style={styles.rankContainer}>
              <View
                style={[styles.rankBadge, { backgroundColor: rankColor }]}
              >
                <Text style={styles.rankBadgeText}>
                  {rank.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankTitle}>{rankDesc}</Text>
                <Text style={styles.rankSubtitle}>{rank.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpProgress,
                  {
                    width: `${Math.min((user.xp % 1000) / 10, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.xpLabel}>
              {user.xp} XP • {Math.floor(user.xp / 1000) + 1} Level
            </Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{workouts.length}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{workoutsThisWeek}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {goal.split('-').pop()?.charAt(0).toUpperCase()}
              </Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/active-workout')}
          >
            <Text style={styles.actionButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => router.push('/workouts')}
            >
              <Text style={styles.sectionTitle}>🎯</Text>
              <Text style={styles.quickLinkText}>Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => router.push('/exercises')}
            >
              <Text style={styles.sectionTitle}>📚</Text>
              <Text style={styles.quickLinkText}>Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => router.push('/progress')}
            >
              <Text style={styles.sectionTitle}>📈</Text>
              <Text style={styles.quickLinkText}>Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.sectionTitle}>⚙️</Text>
              <Text style={styles.quickLinkText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {workouts.length === 0 && (
          <View style={styles.section}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start your fitness journey today! 🔥
              </Text>
              <Text style={styles.emptyStateText}>
                Complete your first workout to earn XP and build your streak.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
