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
      LeaderboardScreen: 'leaderboard',
      EventCheckIn: {
        path: 'event-checkin',
        parse: {
          event_id: id => `${id}`, // ✅ Enables ?event_id=E001
        },
      },
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
