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
import { useRouter } from 'expo-router';
import { getSelectedGoal, getSelectedEquipment } from '../utils/storage';
import { Goal, Equipment } from '../data/types';
import { slugToLabel } from '../utils/helpers';

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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  planCardActive: {
    borderColor: '#FFB81C',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 18,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB81C',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  startButton: {
    backgroundColor: '#FFB81C',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  comingSoon: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

// Plan templates - These are placeholders for the actual workout data
// In production, these would be loaded from a database or API
const PLAN_TEMPLATES = [
  {
    id: '3-months',
    name: '3 Month Kickstarter',
    duration: '3 months',
    difficulty: 'Beginner',
    description: 'Get started with a basic routine. Perfect for building good habits.',
    weeks: 12,
  },
  {
    id: '6-months',
    name: '6 Month Recomp',
    duration: '6 months',
    difficulty: 'Intermediate',
    description: 'Build strength while managing weight with structured progression.',
    weeks: 24,
  },
  {
    id: '9-months',
    name: '9 Month Shred',
    duration: '9 months',
    difficulty: 'Advanced',
    description: 'Intense fat loss program with strategic cardio and strength work.',
    weeks: 36,
  },
  {
    id: '12-months',
    name: '12 Month Transformation',
    duration: '12 months',
    difficulty: 'Advanced',
    description: 'Complete body transformation with progressive overload and periodization.',
    weeks: 52,
  },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      const selectedGoal = await getSelectedGoal();
      const selectedEquipment = await getSelectedEquipment();
      setGoal(selectedGoal);
      setEquipment(selectedEquipment);
      setLoading(false);
    };
    loadPreferences();
  }, []);

  const handleSelectPlan = (planId: string) => {
    Alert.alert(
      'Start Plan?',
      'You can start this workout plan now. Progress will be tracked and saved.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: () => {
            router.push('/active-workout');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Plans</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Plans</Text>
          <Text style={styles.subtitle}>
            {goal && slugToLabel(goal)} • {equipment && slugToLabel(equipment)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Official Plans</Text>

          {PLAN_TEMPLATES.map((plan) => (
            <View key={plan.id} style={[styles.planCard, styles.planCardActive]}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.planDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>{plan.duration}</Text>
                  <Text style={styles.detailLabel}>Duration</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>{plan.weeks} weeks</Text>
                  <Text style={styles.detailLabel}>Schedule</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>{plan.difficulty}</Text>
                  <Text style={styles.detailLabel}>Level</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleSelectPlan(plan.id)}
              >
                <Text style={styles.startButtonText}>Start Plan</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Workouts</Text>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>
              Create your own custom workout plans and save your favorite exercises.
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: '#FFB81C',
                borderRadius: 6,
              }}
              onPress={() =>
                Alert.alert('Coming Soon', 'Custom workouts will be available soon!')
              }
            >
              <Text style={{ color: '#000', fontWeight: '600' }}>
                Build Custom Workout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
