import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { FarmProvider } from '../hooks/useFarmContext';
import HomeScreen from '../screens/HomeScreen';
import DiagnoseScreen from '../screens/DiagnoseScreen';
import PlotsScreen from '../screens/PlotsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../lib/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color: tabColor, size: tabSize }: any) => (
            <MaterialIcons name="home" size={tabSize} color={tabColor} />
          ),
        }}
      />
      <Tab.Screen
        name="DiagnoseTab"
        component={DiagnoseScreen}
        options={{
          tabBarLabel: 'Diagnosticar',
          tabBarIcon: ({ color: tabColor, size: tabSize }: any) => (
            <MaterialIcons name="camera-alt" size={tabSize} color={tabColor} />
          ),
        }}
      />
      <Tab.Screen
        name="PlotsTab"
        component={PlotsScreen}
        options={{
          tabBarLabel: 'Lotes',
          tabBarIcon: ({ color: tabColor, size: tabSize }: any) => (
            <MaterialIcons name="landscape" size={tabSize} color={tabColor} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color: tabColor, size: tabSize }: any) => (
            <MaterialIcons name="person" size={tabSize} color={tabColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={HomeTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <FarmProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </FarmProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});