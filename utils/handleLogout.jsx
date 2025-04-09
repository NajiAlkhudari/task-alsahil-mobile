import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleLogout = () => {
  const router = useRouter();

  return async () => {
    try {
      await AsyncStorage.removeItem("token");

      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);

      alert("An error occurred while logging out. Please try again.");
    }
  };
};