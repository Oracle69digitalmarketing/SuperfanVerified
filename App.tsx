// App.tsx
import './globals'; // This must be the very first import
import React from 'react';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import MainApp from './MainApp';

const App = () => {
  const config = {
    rpcUrl: 'https://accounts.spotify.com/authorize',
    chainId: 'xion-testnet-2'
  };

  return (
    <AbstraxionProvider config={config}>
      <MainApp />
    </AbstraxionProvider>
  );
};

export default App;




