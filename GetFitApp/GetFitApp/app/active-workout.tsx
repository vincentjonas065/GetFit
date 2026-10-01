import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { generateId, formatTime, getDateString } from '../utils/helpers';
import { XP_CONFIG } from '../data/ranks';
import { EXERCISES } from '../data/exercises';
import {
  getUser,
  saveUser,
  saveCompletedWorkout,
  getCompletedWorkouts,
} from '../utils/storage';
import { User, CompletedWorkout } from '../data/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB81C',
  },
  closeButton: {
    fontSize: 24,
  },
  exerciseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  exerciseImage: {
    width: 280,
    height: 280,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  exerciseMeta: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB81C',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#FFB81C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFB81C',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#FFB81C',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB81C',
  },
  restTimer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFB81C',
    marginBottom: 12,
    textAlign: 'center',
  },
  restText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseInstructions: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  instructionText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
  },
});

// Sample workout plan - In production, this would come from a database
const SAMPLE_WORKOUT = [
  { exerciseId: 'bench_press', sets: 3, reps: 8, restSeconds: 120 },
  { exerciseId: 'lat_pulldown', sets: 3, reps: 12, restSeconds: 90 },
  { exerciseId: 'overhead_press', sets: 3, reps: 8, restSeconds: 120 },
  { exerciseId: 'barbell_row_bent', sets: 3, reps: 8, restSeconds: 120 },
];

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!isPaused) {
      timerInterval.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);

        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) {
              setIsResting(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [isPaused, isResting]);

  const currentExerciseData = SAMPLE_WORKOUT[currentExerciseIndex];
  const exercise = EXERCISES[currentExerciseData.exerciseId];
  const isLastSet = currentSet === currentExerciseData.sets;
  const isLastExercise = currentExerciseIndex === SAMPLE_WORKOUT.length - 1;

  const handleCompleteSet = () => {
    if (isLastSet) {
      if (isLastExercise) {
        // Workout complete
        handleCompleteWorkout();
      } else {
        // Move to next exercise
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setIsResting(false);
        setRestTime(0);
      }
    } else {
      // Start rest period
      setIsResting(true);
      setRestTime(currentExerciseData.restSeconds);
    }
  };

  const handleContinueAfterRest = () => {
    setIsResting(false);
    setRestTime(0);
    setCurrentSet((prev) => prev + 1);
  };

  const handleCompleteWorkout = async () => {
    if (!user) return;

    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed ${SAMPLE_WORKOUT.length} exercises in ${formatTime(elapsedTime)}.\n\nYou earned 100 XP!`,
      [
        {
          text: 'Finish',
          onPress: async () => {
            // Update user XP
            const updatedUser = {
              ...user,
              xp: user.xp + 100,
              totalWorkoutsCompleted: user.totalWorkoutsCompleted + 1,
            };
            await saveUser(updatedUser);

            // Save completed workout
            const completedWorkout: CompletedWorkout = {
              id: generateId('workout'),
              planId: 'sample-plan',
              date: getDateString(),
              duration: elapsedTime,
              exercisesCompleted: SAMPLE_WORKOUT.length,
              xpEarned: 100,
            };
            await saveCompletedWorkout(completedWorkout);

            // Navigate back to home
            router.replace('/home');
          },
        },
      ]
    );
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Workout?',
      'Your progress will not be saved. Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Quit',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout</Text>
        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        <TouchableOpacity onPress={handleQuit}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Exercise {currentExerciseIndex + 1} of {SAMPLE_WORKOUT.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentExerciseIndex + 1) / SAMPLE_WORKOUT.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.exerciseContainer}>
        {exercise.imageUrl && (
          <Image
            source={exercise.imageUrl}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
        )}

        <Text style={styles.exerciseName}>{exercise.name}</Text>

        {isResting ? (
          <View style={styles.exerciseMeta}>
            <Text style={styles.restText}>Rest Time</Text>
            <Text style={styles.restTimer}>{restTime}s</Text>
          </View>
        ) : (
          <View style={styles.exerciseMeta}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{currentSet}</Text>
                <Text style={styles.metaLabel}>Set</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>
                  {currentExerciseData.reps || '×'}
                </Text>
                <Text style={styles.metaLabel}>Reps</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>
                  {currentExerciseData.restSeconds}s
                </Text>
                <Text style={styles.metaLabel}>Rest</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>
          {currentExerciseIndex > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setCurrentExerciseIndex((prev) => prev - 1);
                setCurrentSet(1);
                setIsResting(false);
              }}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                ← Prev
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isResting ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinueAfterRest}
          >
            <Text style={styles.buttonText}>Ready? Next Set →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCompleteSet}
            disabled={isPaused}
          >
            <Text style={styles.buttonText}>
              {isLastSet
                ? isLastExercise
                  ? 'Complete Workout ✓'
                  : 'Next Exercise →'
                : 'Complete Set ✓'}
            </Text>
          </TouchableOpacity>
        )}

        {currentExerciseIndex < SAMPLE_WORKOUT.length - 1 && !isResting && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => {
              setCurrentExerciseIndex((prev) => prev + 1);
              setCurrentSet(1);
              setIsResting(false);
            }}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Skip to Next
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
