// import React, { useEffect, useState } from 'react';
// import * as SplashScreen from 'expo-splash-screen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// SplashScreen.preventAutoHideAsync();

// export default function Index() {
//   const [appReady, setAppReady] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const prepare = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (token) {
//         router.replace('/home');
//       } else {
//         router.replace('/(auth)/login');
//       }

//       setAppReady(true);
//       await SplashScreen.hideAsync(); 
//     };

//     prepare();
//   }, []);

//   if (!appReady) return null;

//   return null; 
// }

// app/index.js
import React, { useEffect, useState, useContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { NotificationContext } from '../context/NotificationContext';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();
  const { registerForPushNotifications } = useContext(NotificationContext); // ⬅️ استخدام الكونتكست

  useEffect(() => {
    const prepare = async () => {
      try {
        await registerForPushNotifications(); // ⬅️ تشغيل تسجيل التنبيهات

        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!appReady) return null;

  return null;
}
