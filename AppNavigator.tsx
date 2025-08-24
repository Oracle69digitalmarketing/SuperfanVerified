import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StakingScreen from './screens/StakingScreen';
import GovernanceScreen from './screens/GovernanceScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import UsersScreen from './screens/UsersScreen';
import ScansScreen from './screens/ScansScreen';
import VotingHistoryScreen from './screens/VotingHistoryScreen';
import EventCheckInScreen from './screens/EventCheckInScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

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
      <Stack.Screen name="Scans" component={ScansScreen} />
      <Stack.Screen name="VotingHistory" component={VotingHistoryScreen} /> {/* ✅ Added */}
      <Stack.Screen name="EventCheckIn" component={EventCheckInScreen} /> {/* ✅ Added */}
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} /> {/* ✅ Added */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
