import React from 'react';
import { View, StyleSheet } from 'react-native';
import WalletProvider from './WalletProvider';
import { LoginButton } from './LoginButton';
import AppNavigator from './AppNavigator'; // Assuming you have a navigator for the main app
import { useWallet } from './WalletProvider';

function AppContent() {
  const { account } = useWallet();

  if (!account) {
    return (
      <View style={styles.container}>
        <LoginButton />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function MainApp() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});