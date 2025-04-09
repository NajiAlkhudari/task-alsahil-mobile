

import { Stack } from "expo-router/stack";
import { Provider } from "react-redux";
import store from "../store/index.js";
import {Header} from "../components/Header.jsx";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options = {{header : ()=><Header />}} />
        <Stack.Screen name="addVisit"  />

      </Stack>
    </Provider>
  );
}
