import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { EXERCISES } from '../data/exercises';
import { Exercise, Equipment, Goal } from '../data/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FFB81C',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  filterLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterScroll: {
    marginBottom: 0,
  },
  filterButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFB81C',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#FFB81C',
  },
  filterButtonText: {
    color: '#FFB81C',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseCardContent: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metaTag: {
    backgroundColor: '#0a0a0a',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaTagText: {
    fontSize: 11,
    color: '#FFB81C',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFB81C',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
});

type FilterType = 'all' | 'equipment' | 'goal' | 'difficulty';

const EQUIPMENT_FILTERS: Equipment[] = [
  'full-gym',
  'no-equipment',
  'barbell',
  'dumbbell',
  'speed',
];

const GOAL_FILTERS: Goal[] = [
  'lose-weight',
  'build-endurance',
  'gain-speed',
  'gain-strength',
];

const DIFFICULTY_FILTERS = ['beginner', 'intermediate', 'advanced'];

export default function ExercisesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const filteredExercises = useMemo(() => {
    return Object.values(EXERCISES).filter((exercise) => {
      const matchesSearch =
        searchQuery === '' ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEquipment =
        selectedEquipment === null ||
        exercise.equipment.includes(selectedEquipment);

      const matchesGoal =
        selectedGoal === null || exercise.goals.includes(selectedGoal);

      const matchesDifficulty =
        selectedDifficulty === null || exercise.difficulty === selectedDifficulty;

      return (
        matchesSearch && matchesEquipment && matchesGoal && matchesDifficulty
      );
    });
  }, [searchQuery, selectedEquipment, selectedGoal, selectedDifficulty]);

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseCardContent}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDescription}>{item.description}</Text>

        <View style={styles.exerciseMeta}>
          <View style={styles.metaTag}>
            <Text style={styles.metaTagText}>
              {item.difficulty.charAt(0).toUpperCase()}
            </Text>
          </View>
          {item.reps && (
            <View style={styles.metaTag}>
              <Text style={styles.metaTagText}>{item.reps} reps</Text>
            </View>
          )}
          {item.time && (
            <View style={styles.metaTag}>
              <Text style={styles.metaTagText}>{item.time}s</Text>
            </View>
          )}
        </View>

        <View style={styles.exerciseActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Open exercise details
              router.push({
                pathname: '/exercises/[id]',
                params: { id: item.id },
              });
            }}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Library</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Equipment</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedEquipment === null && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedEquipment(null)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedEquipment === null && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {EQUIPMENT_FILTERS.map((equip) => (
            <TouchableOpacity
              key={equip}
              style={[
                styles.filterButton,
                selectedEquipment === equip && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedEquipment(equip)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedEquipment === equip && styles.filterButtonTextActive,
                ]}
              >
                {equip.replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Difficulty</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedDifficulty === null && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDifficulty(null)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDifficulty === null && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {DIFFICULTY_FILTERS.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.filterButton,
                selectedDifficulty === diff && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === diff && styles.filterButtonTextActive,
                ]}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredExercises.length > 0 ? (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No exercises found</Text>
          <Text style={styles.emptyStateText}>Try adjusting your filters</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
