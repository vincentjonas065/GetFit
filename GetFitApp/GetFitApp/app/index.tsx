import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUser } from '../utils/storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/onboarding');
      }
    };

    const timer = setTimeout(checkUser, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
