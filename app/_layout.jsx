import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="(tabs)/_layout" options={{ headerShown: false }} />  */}
        <Stack.Screen name="(auth)/login" />
      </Stack>
    </Provider>
  );
}