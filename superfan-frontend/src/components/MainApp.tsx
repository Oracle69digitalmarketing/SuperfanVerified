import React, { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";

import RootNavigator from "./RootNavigator";
import linking from "./linking";
import { setupDatabase } from "./db";

export default function MainApp() {
  useEffect(() => {
    LogBox.ignoreLogs(["Non-serializable values"]);
    // Only run native-only setup on mobile
    if (Platform.OS !== "web") {
      setupDatabase(); // SQLite / native DB
    }
  }, []);

  return (
    <AbstraxionProvider
      config={{
        appName: "SuperfanVerified",
        chainId: "xion-testnet-1",
      }}
    >
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </AbstraxionProvider>
  );
}
