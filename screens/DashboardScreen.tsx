import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';
import { WalletContext } from './providers/WalletProvider'; // Adjust path as needed

// Real Screens
import WalletScreen from './screens/WalletScreen'; // Replace with your actual wallet screen
import DashboardScreen from './screens/DashboardScreen'; // Replace with your actual dashboard

const linking = {
  prefixes: ['superfanverified://'],
  config: {
    screens: {
      Wallet: 'wallet',
      Dashboard: 'dashboard',
    },
  },
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const wallet = useContext(WalletContext);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
