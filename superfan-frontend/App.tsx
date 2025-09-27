import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import MainApp from "./src/components/MainApp"; // ✅ corrected path

export default function App() {
  // Web fallback
  if (Platform.OS === "web") {
    try {
      return <MainApp />;
    } catch (err) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Something went wrong loading the app in the browser.
          </Text>
          <Text style={styles.errorText}>{err.message}</Text>
        </View>
      );
    }
  }

  // Native (iOS / Android)
  return <MainApp />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
