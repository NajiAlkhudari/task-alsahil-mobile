import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar ,Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          router.replace("/home"); 
        } else {
          router.replace("/(auth)/login"); 
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.replace("/(auth)/login"); 
      }
    };
    setTimeout(() => {
      checkAuthStatus();
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1769aa" barStyle="light-content" />

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <Image source={require('../assets/images/splash.png')}  />
          <Text style={styles.text}>Task Log</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.text1}>from</Text>
          <Text style={styles.text1}>AlSahil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1769aa',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20, 
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    marginBottom: 20, 
  },
  text: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center', 
    fontWeight:'semibold'
  },
});