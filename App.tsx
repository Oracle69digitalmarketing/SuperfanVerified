// App.tsx
import './globals'; // This must be the very first import
import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import LogRocket from '@logrocket/react-native';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import MainApp from './MainApp';

const App = () => {
  useEffect(() => {
    LogRocket.init('0k70xf/superfanverified', {
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);

  const config = {
    rpcUrl: 'https://rpc.xion-testnet-2.burnt.com:443',
    chainId: 'xion-testnet-2'
  };

  return (
    <AbstraxionProvider config={config}>
      <MainApp />
    </AbstraxionProvider>
  );
};

export default App;




