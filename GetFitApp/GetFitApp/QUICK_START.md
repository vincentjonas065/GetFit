# GetFit - Quick Start Guide (5 Minutes)

## 🚀 Build & Install in 5 Steps

### Step 1: Prerequisites (2 min)
```bash
# Make sure you have Node.js installed
node --version  # Should be 16+

# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for building APK)
npm install -g eas-cli
```

### Step 2: Navigate to Project (1 min)
```bash
cd GetFitApp
```

### Step 3: Install Dependencies (2 min)
```bash
npm install
```

### Step 4: Build APK (5-15 min)
```bash
# Login to Expo (create account at https://expo.dev if needed)
eas login

# Start the build
eas build --platform android

# Select "APK" when prompted
# Wait for the build to complete
```

### Step 5: Download & Install (1 min)
- Click the download link provided
- Transfer APK to your Android phone
- Open file manager and tap the APK to install
- Or use: `adb install path/to/getfit.apk`

**Total Time: 15-25 minutes** ⏱️

---

## 📱 First-Time Setup

1. **Launch App** - Tap GetFit icon
2. **Enter Your Name** - Type your name
3. **Select Goal** - Choose: Lose Weight, Build Endurance, Gain Speed, or Gain Strength
4. **Select Equipment** - Choose your available equipment
5. **Start Dashboard** - You're ready to go!

---

## 🏋️ First Workout

1. **Tap "Start Workout"** on home screen
2. **See Exercise** - Current exercise with GIF animation
3. **Complete Set** - Do the reps/time and tap "Complete Set ✓"
4. **Rest** - Follow the rest timer
5. **Next Set** - Tap "Ready? Next Set →" after rest
6. **Finish** - Complete all exercises to finish workout

---

## 📚 Key Screens

| Screen | Purpose | How to Access |
|--------|---------|---------------|
| **Home** | Dashboard, stats | Default screen |
| **Exercises** | Browse 30+ exercises | 📚 button on home |
| **Workouts** | View workout plans | 🎯 button on home |
| **Active Workout** | Do a workout | "Start Workout" button |
| **Progress** | Track your stats | 📈 button on home |
| **Settings** | Manage account | ⚙️ button on home |

---

## ⚙️ Customization (Optional)

### Add Your Workout Plans
1. Open `data/workoutPlans.ts` (create if doesn't exist)
2. Add your workout plan data
3. Rebuild APK with `eas build --platform android`

### Change Colors
Find and replace these hex codes throughout app files:
- `#FFB81C` - Gold (primary color)
- `#000000` - Black (background)
- `#1a1a1a` - Dark gray (cards)

### Add Exercise GIFs
1. Place GIF files in `assets/images/exercises/[category]/`
2. Update exercise in `data/exercises.ts` with correct path
3. Rebuild APK

---

## 🐛 Troubleshooting

### "Build Failed"
```bash
eas build --platform android --clear-cache
```

### "App Won't Start"
1. Clear app data in Settings
2. Reinstall APK
3. Check device storage (need 100MB+)

### "GIFs Not Showing"
1. Check image paths are correct
2. Rebuild APK
3. Clear cache: `adb shell pm clear com.yourcompany.getfit`

### "Workouts Not Saving"
1. Close and reopen app
2. Check Android permissions
3. Reinstall app and test

---

## 📝 Common Customizations

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name"
  }
}
```

### Change Package Name
Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.appname"
    }
  }
}
```

### Change Rank Thresholds
Edit `data/ranks.ts`:
```typescript
export const RANK_THRESHOLDS = [
  { rank: 'rookie', minXp: 0, maxXp: 999 },
  // ... change these values
];
```

---

## 📊 What's Included

✅ Full workout app  
✅ 30+ exercises with GIFs  
✅ Ranking system (Rookie → Elite)  
✅ Progress tracking  
✅ Offline support  
✅ Local data storage  
✅ Athletic UI design  

---

## 🔗 Links & Resources

- [Full Build Guide](./BUILD_GUIDE.md) - Detailed build instructions
- [Project Summary](./PROJECT_SUMMARY.md) - Complete feature breakdown
- [Expo Docs](https://docs.expo.dev) - Official documentation
- [React Native Docs](https://reactnative.dev) - Framework docs

---

## ✨ Next Steps After Building

1. **Test App** - Try onboarding and first workout
2. **Add Plans** - Create workout plan data
3. **Customize** - Adjust colors, names, ranks
4. **Publish** - Submit to Google Play Store

---

## 💡 Pro Tips

- **Always test on real phone**, not emulator
- **Workouts auto-save** - Your progress is persistent
- **Works offline** - No internet needed
- **Backup data** - Export workouts if needed
- **Check logs** - Run `npx expo start --android` to debug

---

## 📞 Still Need Help?

1. Check [Build Guide](./BUILD_GUIDE.md) for detailed steps
2. See [Project Summary](./PROJECT_SUMMARY.md) for architecture
3. Check Expo Docs if build fails
4. Review console logs: `npx expo start --android` (press j to see logs)

---

**Ready to build?** Run these commands:
```bash
cd GetFitApp
eas login
eas build --platform android
```

That's it! 🚀

---

**Time to first APK**: 15-25 minutes  
**Time to customized APK**: 1-2 hours  
**Time to store submission**: 4-6 hours total  

Good luck! 💪
