import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StakingScreen from './screens/StakingScreen';
import GovernanceScreen from './screens/GovernanceScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import UsersScreen from './screens/UsersScreen';
import ScansScreen from './screens/ScansScreen';
import EventCheckInScreen from './screens/EventCheckInScreen';

<Stack.Screen name="EventCheckIn" component={EventCheckInScreen} />
import LeaderboardScreen from './screens/LeaderboardScreen';

<Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} /> // ✅ Added this

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#facc15',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Staking" component={StakingScreen} />
      <Stack.Screen name="Governance" component={GovernanceScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="Scans" component={ScansScreen} /> {/* ✅ New screen */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
