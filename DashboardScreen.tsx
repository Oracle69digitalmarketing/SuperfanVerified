/* 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';

// Dummy Wallet Screen
function WalletScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Wallet Screen</Text>
    </View>
  );
}

// Dummy Dashboard Screen
function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboard Screen</Text>
    </View>
  );
}

// Linking configuration
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

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName=Dashboard>
        <Stack.Screen name=Wallet component={WalletScreen} />
        <Stack.Screen name=Dashboard component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/
