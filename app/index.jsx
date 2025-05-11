import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from 'expo-localization'; 

export default function Index() {
  const router = useRouter();
  const direction = Localization.isRTL ? 'rtl' : 'ltr';

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

    checkAuthStatus();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { writingDirection: direction }]}>
      <StatusBar backgroundColor="#024a70" barStyle="light-content" />

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <Image source={require('../assets/images/splash.png')} style={styles.splashImage} />
          <Text style={[styles.text, { textAlign: direction === 'rtl' ? 'right' : 'left' }]}>Task Log</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={[styles.text1, { textAlign: 'center' }]}>from</Text>
          <Text style={[styles.text1, { textAlign: 'center' }]}>AlSahil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#024a70',
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
    width: '100%', 
  },
  splashImage: {
  },
  bottomSection: {
    marginBottom: 20,
    width: '100%', 
    alignItems: 'center', 
  },
  text: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'semibold',
    textAlign: 'center', 
  },
});