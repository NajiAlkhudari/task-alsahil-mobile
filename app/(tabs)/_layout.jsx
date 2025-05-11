import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {Header} from "../../components/Header"

export default function TabLayout() {
  return (
    <Tabs
         screenOptions={{
        tabBarActiveTintColor: '#024a70', // لون الأيقونة والنص النشط
        tabBarInactiveTintColor: 'gray', // لون الأيقونة والنص غير النشط
      }}
      >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
            header: () => <Header />,
        }}
      />
 
       <Tabs.Screen
        name="addVisit"
        options={{
          tabBarLabel: 'زيارة جديدة',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="finger-print" size={size} color={color} />
          ),
          headerTitle: 'زيارة جديدة',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f5f5f5', 
          },
          headerTintColor: '#024a70',

        }}
      />
<Tabs.Screen
        name="addClient"
        options={{
          tabBarLabel: 'عميل جديد',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: 'عميل جديد',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f5f5f5', 
          },
          headerTintColor: '#024a70',
        }}
      />
    </Tabs>
  );
}