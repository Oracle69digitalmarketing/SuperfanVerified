import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "sentry-expo";
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";

import RootNavigator from "./RootNavigator";
import linking from "./linking";
import { setupDatabase } from "./db";

export default function MainApp() {
  useEffect(() => {
    setupDatabase();
    LogBox.ignoreLogs(["Non-serializable values"]);
  }, []);

  return (
    <AbstraxionProvider
      config={{
        appName: "SuperfanVerified",
        chainId: "xion-testnet-1", // update for mainnet later
      }}
    >
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </AbstraxionProvider>
  );
}
