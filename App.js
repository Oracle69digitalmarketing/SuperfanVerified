import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';

const linking = {
  prefixes: ['superfanverified://'],
  config: {
    screens: {
      Home: 'home',
      Staking: 'staking',
      Governance: 'governance',
      QRScanner: 'qrscanner',
      Users: 'users',
      Scans: 'scans',
      VotingHistory: 'voting-history',
      EventCheckIn: 'event-checkin',
      LeaderboardScreen: 'leaderboard',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
}
