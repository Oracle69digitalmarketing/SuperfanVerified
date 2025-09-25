// MainApp.tsx
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "sentry-expo";

import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";
import AppNavigator from "./AppNavigator";

import linking from "./linking";
import { setupDatabase } from "./db";
import SessionBootstrap from "./SessionBootstrap";

// --- Root App ---
export default function MainApp() {
  useEffect(() => {
    setupDatabase();
    LogBox.ignoreLogs(["Non-serializable values"]); // keep logs clean
  }, []);

  return (
    <AbstraxionProvider
      config={{
        appName: "SuperfanVerified",
        chainId: "xion-testnet-1", // swap for mainnet later
      }}
    >
      <NavigationContainer linking={linking}>
        <SessionBootstrap />
        <AppNavigator />
      </NavigationContainer>
    </AbstraxionProvider>
  );
}
