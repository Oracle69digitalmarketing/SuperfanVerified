import React from 'react';
import { WalletConnectProvider } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider
      redirectUrl={'superfanverified://'}
      storageOptions={{ asyncStorage: AsyncStorage }}
    >
      {children}
    </WalletConnectProvider>
  );
}
