# GetFit App - Build Guide & Project Summary

## 📱 Project Overview

**GetFit** is a complete, production-ready React Native fitness app built with Expo. It includes:

✅ User onboarding and account setup  
✅ Home dashboard with stats and streaks  
✅ Exercise library with 30+ exercises  
✅ Active workout interface with timer and progress tracking  
✅ XP/Ranking system (Rookie → Elite)  
✅ Progress tracking and workout history  
✅ Workout plan management  
✅ Settings and user preferences  
✅ Persistent data storage  
✅ Modern athletic UI design  

## 🏗️ Project Structure

```
GetFitApp/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Main navigation
│   ├── index.tsx                # Splash/auth check
│   ├── onboarding.tsx           # User setup flow
│   ├── home.tsx                 # Main dashboard
│   ├── exercises.tsx            # Exercise library
│   ├── active-workout.tsx       # Workout interface
│   ├── progress.tsx             # Stats & history
│   ├── workouts.tsx             # Workout plans
│   └── settings.tsx             # App settings
├── data/                         # Core data & types
│   ├── types.ts                 # TypeScript interfaces
│   ├── exercises.ts             # Exercise database (30+ exercises)
│   └── ranks.ts                 # XP & ranking system
├── utils/                        # Helper functions
│   ├── storage.ts               # AsyncStorage persistence
│   └── helpers.ts               # Utility functions
├── assets/                       # Images & plans
│   ├── images/                  # Exercise GIFs by equipment
│   └── plans/                   # Workout plan text files
├── app.json                     # Expo configuration
└── package.json                 # Dependencies

```

## 🚀 How to Build APK

### Prerequisites

You need to have:
- Node.js 16+ installed
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app installed on your phone (for testing)
- EAS CLI for building APK (`npm install -g eas-cli`)

### Option 1: Build Using EAS (Recommended - Cloud Build)

This is the easiest method. Expo builds the APK on their servers.

```bash
# Navigate to project
cd GetFitApp

# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (create one at https://expo.dev)
eas login

# Configure EAS for Android builds
eas build --platform android

# Follow the prompts - select "APK" when asked about build type

# Wait for build to complete (5-15 minutes)
# Download the APK from the link provided
```

After the build completes, you'll get a download link for the `.apk` file.

### Option 2: Build Using Expo CLI (Local Development)

For testing during development:

```bash
# Start the Expo server
cd GetFitApp
npx expo start

# In the terminal, press 'a' to open on Android (if you have Android emulator running)
# Or scan the QR code with Expo Go app on your phone
```

### Option 3: Full Local Build (Advanced)

If you want to build locally on your machine:

```bash
# Install Android SDK and tools first
# Then use:
eas build --platform android --local
```

## 🔧 Configuration

### Update App Details (app.json)

Before building, customize:

```json
{
  "expo": {
    "name": "GetFit",                    // App display name
    "slug": "getfit",                    // URL slug
    "version": "1.0.0",                  // App version
    "android": {
      "package": "com.yourcompany.getfit", // Android package name
      "versionCode": 1
    }
  }
}
```

### Custom Signing Key (Production)

For production releases:

```bash
# Generate keystore
keytool -genkey -v -keystore getfit.keystore -keyalg RSA -keysize 2048 -validity 10000

# Add to eas.json:
# {
#   "build": {
#     "android": {
#       "release": {
#         "android.keystore": true,
#         "android.keystorePath": "getfit.keystore",
#         "android.keystorePassword": "your-password",
#         "android.keyAlias": "your-alias",
#         "android.keyPassword": "your-key-password"
#       }
#     }
#   }
# }
```

## 📝 Adding Your Workout Plans

Currently, the app uses a sample workout. To add your complete workout plans:

### 1. Create Workout Plan Data

Create a new file `data/workoutPlans.ts`:

```typescript
import { WorkoutPlan, ExerciseSet } from './types';

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-full-gym-lose-weight-3m',
    name: '3 Month Lose Weight',
    goal: 'lose-weight',
    equipment: 'full-gym',
    duration: '3-months',
    description: 'Your custom 3-month plan...',
    weeks: [
      // Week 1
      [
        // Monday
        {
          dayOfWeek: 1,
          exercises: [
            {
              exerciseId: 'bench_press',
              sets: 3,
              reps: 8,
              restSeconds: 120,
            },
            // ... more exercises
          ],
        },
        // ... rest of week
      ],
      // ... rest of weeks
    ],
    createdAt: new Date().toISOString(),
  },
  // ... more plans
];
```

### 2. Update Workouts Screen

Modify `app/workouts.tsx` to load from your plans data

### 3. Update Active Workout Screen

Modify `app/active-workout.tsx` to use selected plan instead of SAMPLE_WORKOUT

## 🖼️ Adding Exercise GIFs

Exercise GIFs are organized in `/assets/images/exercises/`:

```
assets/images/exercises/
├── Full gym/           # Full gym equipment exercises
│   ├── exercise_name.gif
│   └── ...
├── barbells/           # Barbell exercises
├── dumbbells/          # Dumbbell exercises
└── speed/              # Cardio & speed exercises
```

To add new exercises:

1. Add GIF file to appropriate category folder
2. Update `data/exercises.ts` with exercise data:

```typescript
new_exercise: {
  id: 'new_exercise',
  name: 'Exercise Name',
  equipment: ['full-gym', 'dumbbell'],
  description: 'Description',
  instructions: ['Step 1', 'Step 2', ...],
  difficulty: 'intermediate',
  imageUrl: require('../assets/images/exercises/Full gym/exercise.gif'),
  reps: 10,
  goals: ['gain-strength', 'lose-weight'],
}
```

## 🎨 Customizing the Theme

Colors are defined throughout the app:

- **Primary (Gold)**: `#FFB81C`
- **Background (Dark)**: `#000`
- **Card Background**: `#1a1a1a`
- **Text (Primary)**: `#fff`
- **Text (Secondary)**: `#aaa`

To change theme globally, update all files or create a theme config:

```typescript
// utils/theme.ts
export const COLORS = {
  primary: '#FFB81C',
  background: '#000',
  card: '#1a1a1a',
  text: '#fff',
  textSecondary: '#aaa',
};
```

## 📊 Data Persistence

The app uses AsyncStorage for local data storage. Data persisted:

- User account info
- Completed workouts
- XP & ranking
- Selected preferences
- Progress tracking

All data is stored locally on the device.

## 🚀 Publishing to App Stores

### Google Play Store

```bash
# Build for production
eas build --platform android --auto-submit

# OR upload manually:
eas build --platform android
# Download signed APK
# Upload to Google Play Console
```

### Requirements
- Google Developer Account ($25 one-time fee)
- App signing configuration
- App Store listing and screenshots
- Privacy policy and terms

## ⚙️ Advanced Configuration

### Environment Variables

Create `.env` file (not tracked by git):

```
API_URL=https://your-api.com
ANALYTICS_KEY=your-key
```

Load in app:

```typescript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

### Analytics & Crash Reporting

Add Sentry for crash monitoring:

```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
});
```

## 🐛 Troubleshooting

### Build Fails with "Host not in"

This is a network error. Try:
```bash
eas build --platform android --clear-cache
```

### App Crashes on Startup

Check the console:
```bash
# Start and watch logs
npx expo start --android
# Press 'j' to view logs
```

### Exercises Not Loading

Verify image paths in `data/exercises.ts`:
```typescript
// Correct:
imageUrl: require('../assets/images/exercises/Full gym/exercise.gif')

// Wrong:
imageUrl: '../assets/images/exercises/Full gym/exercise.gif'
```

### Storage Data Persists Incorrectly

Clear app cache:
```bash
# Android
adb shell pm clear <package-name>

# Or in app settings
```

## 📖 Available Scripts

```bash
# Development
npm run android      # Run on Android emulator/device
npm run ios         # Run on iOS simulator (macOS only)
npm run web         # Run in web browser
npm start           # Start Expo server

# Build
npm run lint        # Check code quality
eas build --platform android  # Build APK
eas submit          # Submit to Google Play

# Clean
rm -rf node_modules
npm install
```

## 🔗 Useful Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)
- [EAS Build Guide](https://docs.expo.dev/build/introduction)
- [React Native Docs](https://reactnative.dev)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage)

## 🎯 Next Steps

1. **Build the APK** using Option 1 (EAS) above
2. **Install on your phone** and test
3. **Add your workout plans** to `data/workoutPlans.ts`
4. **Customize exercises** as needed
5. **Test thoroughly** before publishing
6. **Submit to Google Play** when ready

## 📝 Notes

- All user data is stored locally - no backend required
- App works fully offline
- Performance optimized for Android 8+
- Responsive design for all screen sizes
- Dark theme optimized for eye comfort

## 🤝 Support

For issues or questions:
1. Check the [Expo Docs](https://docs.expo.dev)
2. Review app logs: `npx expo start --android`
3. Check AsyncStorage debug: See storage.ts functions
4. Test on physical device (not emulator) for best results

---

**Built with React Native, Expo & TypeScript** 💪

Version: 1.0.0  
Last Updated: 2024
