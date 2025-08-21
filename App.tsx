import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React from 'react';
import WalletProvider from './WalletProvider';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <WalletProvider>
      <AppNavigator />
    </WalletProvider>
  );
}
