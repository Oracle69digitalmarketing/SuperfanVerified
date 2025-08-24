import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import StakingScreen from './screens/StakingScreen';
import GovernanceScreen from './screens/GovernanceScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import UsersScreen from './screens/UsersScreen';
import ScansScreen from './screens/ScansScreen';
import VotingHistoryScreen from './screens/VotingHistoryScreen';
import EventCheckInScreen from './screens/EventCheckInScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ArtistDashboard from './screens/ArtistDashboard';

<Stack.Screen name="ArtistDashboard" component={ArtistDashboard} />

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
      <Stack.Screen name="VotingHistory" component={VotingHistoryScreen} />
      <Stack.Screen
        name="EventCheckIn"
        component={EventCheckInScreen}
        options={{ title: '🎟️ Event Check-In' }}
      />
      <Stack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{ title: '🏆 Fan Leaderboard' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
