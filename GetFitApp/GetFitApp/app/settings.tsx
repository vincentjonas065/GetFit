import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getUser,
  getSelectedGoal,
  getSelectedEquipment,
  clearAllData,
} from '../utils/storage';
import { User, Goal, Equipment } from '../data/types';
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    color: '#aaa',
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  settingLabel: {
    fontSize: 14,
    color: '#fff',
  },
  settingValue: {
    fontSize: 13,
    color: '#FFB81C',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB81C',
  },
  infoLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  button: {
    backgroundColor: '#FFB81C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDanger: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDanger: {
    color: '#ff4444',
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const userData = await getUser();
      const selectedGoal = await getSelectedGoal();
      const selectedEquipment = await getSelectedEquipment();

      setUser(userData);
      setGoal(selectedGoal);
      setEquipment(selectedEquipment);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleChangeGoal = () => {
    Alert.alert(
      'Change Goal',
      'Select your new fitness goal',
      [
        {
          text: 'Lose Weight',
          onPress: () => {
            // Update goal logic here
            Alert.alert('Success', 'Goal updated to Lose Weight');
          },
        },
        {
          text: 'Build Endurance',
          onPress: () => {
            Alert.alert('Success', 'Goal updated to Build Endurance');
          },
        },
        {
          text: 'Gain Speed',
          onPress: () => {
            Alert.alert('Success', 'Goal updated to Gain Speed');
          },
        },
        {
          text: 'Gain Strength',
          onPress: () => {
            Alert.alert('Success', 'Goal updated to Gain Strength');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleChangeEquipment = () => {
    Alert.alert(
      'Change Equipment',
      'Select your available equipment',
      [
        {
          text: 'Full Gym',
          onPress: () => {
            Alert.alert('Success', 'Equipment updated to Full Gym');
          },
        },
        {
          text: 'No Equipment',
          onPress: () => {
            Alert.alert('Success', 'Equipment updated to No Equipment');
          },
        },
        {
          text: 'Barbell',
          onPress: () => {
            Alert.alert('Success', 'Equipment updated to Barbell');
          },
        },
        {
          text: 'Dumbbell',
          onPress: () => {
            Alert.alert('Success', 'Equipment updated to Dumbbell');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleResetAccount = () => {
    Alert.alert(
      'Reset Account?',
      'This will clear all your data including workouts, XP, and progress. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: async () => {
            await clearAllData();
            router.replace('/onboarding');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Total XP</Text>
            <Text style={styles.infoValue}>{user.xp}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Workouts Completed</Text>
            <Text style={styles.infoValue}>{user.totalWorkoutsCompleted}</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangeGoal}
          >
            <Text style={styles.settingLabel}>Fitness Goal</Text>
            <Text style={styles.settingValue}>
              {goal ? slugToLabel(goal) : 'Not selected'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangeEquipment}
          >
            <Text style={styles.settingLabel}>Equipment</Text>
            <Text style={styles.settingValue}>
              {equipment ? slugToLabel(equipment) : 'Not selected'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333', true: '#FFB81C' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>GetFit</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert(
                'About GetFit',
                'GetFit is your personal fitness companion. Track workouts, earn XP, and achieve your fitness goals!\n\nBuilt with React Native & Expo'
              )
            }
          >
            <Text style={styles.buttonText}>View App Info</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleResetAccount}
          >
            <Text style={[styles.buttonText, styles.buttonTextDanger]}>
              Reset Account
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>GetFit v1.0.0 • Made with 💪</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
