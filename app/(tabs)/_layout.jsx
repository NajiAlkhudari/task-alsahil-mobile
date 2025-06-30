

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';

function AnimatedTabIcon({ name, color, size, focused }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#024a70',
        tabBarInactiveTintColor: '#757575',
        fontFamily: 'Cairo-Bold',

      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="home"
              size={size}
              color={color}
              focused={focused}
            />
          ),
          header: () => <Header />,
        }}
      />



  <Tabs.Screen
        name="Dates"
        options={{

          tabBarLabel: 'المواعيد',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="alert-circle"
              size={size}
              color={color}
              focused={focused}
            />
          ),
          headerTitle: 'المواعيد',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: 'Cairo-SemiBold',
            color: 'black',
          },
          headerTintColor: '#024a70',
        }}
      />






      <Tabs.Screen
        name="addVisit"
        options={{
           headerShown: false ,
          tabBarLabel: 'زيارة جديدة',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="finger-print"
              size={size}
              color={color}
              focused={focused}
            />
          ),
          headerTitle: 'زيارة جديدة',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: 'Cairo-SemiBold',
            color: 'black',
          },
          headerTintColor: '#024a70',
        }}
      />

      <Tabs.Screen
        name="addClient"
        options={{
                     headerShown: false ,

          tabBarLabel: 'عميل جديد',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="person"
              size={size}
              color={color}
              focused={focused}
            />
          ),
          headerTitle: 'عميل جديد',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: 'Cairo-SemiBold',
            color: 'black',
          },
          headerTintColor: '#024a70',
        }}
      />
    </Tabs>
  );
}
