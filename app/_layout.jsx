// import { Stack } from 'expo-router';
// import { Provider } from 'react-redux';
// import store from '../store';

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(auth)/login" />
//       </Stack>
//     </Provider>
//   );
// }


import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';


export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Cairo-Regular': require('../assets/fonts/Cairo-Bold.ttf'),
        'Cairo-Bold': require('../assets/fonts/Cairo-Bold.ttf'),
                'Cairo-Black': require('../assets/fonts/Cairo-Black.ttf'),
        'Cairo-ExtraBold': require('../assets/fonts/Cairo-ExtraBold.ttf'),
                'Cairo-Light': require('../assets/fonts/Cairo-Light.ttf'),
        'Cairo-SemiBold': require('../assets/fonts/Cairo-SemiBold.ttf'),
                'Cairo-Medium': require('../assets/fonts/Cairo-Medium.ttf'),

      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
      </Stack>
    </Provider>
  );
}
