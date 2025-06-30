import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/(auth)/login');
      }

      setAppReady(true);
      await SplashScreen.hideAsync(); 
    };

    prepare();
  }, []);

  if (!appReady) return null;

  return null; 
}

