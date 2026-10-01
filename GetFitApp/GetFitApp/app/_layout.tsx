import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'GetFit' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
        <Stack.Screen name="home" options={{ title: 'Home' }} />
        <Stack.Screen name="workouts" options={{ title: 'Workouts' }} />
        <Stack.Screen name="active-workout" options={{ title: 'Active Workout' }} />
        <Stack.Screen name="progress" options={{ title: 'Progress' }} />
        <Stack.Screen name="exercises" options={{ title: 'Exercises' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
}
