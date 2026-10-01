import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  createUser,
  saveSelectedGoal,
  saveSelectedEquipment,
} from '../utils/storage';
import { Goal, Equipment } from '../data/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FFB81C',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonGrid: {
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFB81C',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FFB81C',
  },
  buttonText: {
    color: '#FFB81C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#FFB81C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
    marginTop: 20,
  },
});

const GOALS: { value: Goal; label: string }[] = [
  { value: 'lose-weight', label: 'Lose Weight' },
  { value: 'build-endurance', label: 'Build Endurance' },
  { value: 'gain-speed', label: 'Gain Speed' },
  { value: 'gain-strength', label: 'Gain Strength' },
];

const EQUIPMENT: { value: Equipment; label: string }[] = [
  { value: 'full-gym', label: 'Full Gym' },
  { value: 'no-equipment', label: 'No Equipment' },
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const canContinue = name.trim() && selectedGoal && selectedEquipment;

  const handleContinue = async () => {
    if (!canContinue) return;

    setLoading(true);
    try {
      const user = await createUser(name.trim());
      if (selectedGoal) await saveSelectedGoal(selectedGoal);
      if (selectedEquipment) await saveSelectedEquipment(selectedEquipment);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Welcome to GetFit</Text>
        <Text style={styles.subtitle}>
          Let's customize your fitness journey
        </Text>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.sectionHeader}>SELECT YOUR GOAL</Text>
        <View style={styles.buttonGrid}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              style={[
                styles.button,
                selectedGoal === goal.value && styles.buttonActive,
              ]}
              onPress={() => setSelectedGoal(goal.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedGoal === goal.value && styles.buttonTextActive,
                ]}
              >
                {goal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>SELECT YOUR EQUIPMENT</Text>
        <View style={styles.buttonGrid}>
          {EQUIPMENT.map((equip) => (
            <TouchableOpacity
              key={equip.value}
              style={[
                styles.button,
                selectedEquipment === equip.value && styles.buttonActive,
              ]}
              onPress={() => setSelectedEquipment(equip.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedEquipment === equip.value && styles.buttonTextActive,
                ]}
              >
                {equip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !canContinue && styles.submitButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue || loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Start Your Journey'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
